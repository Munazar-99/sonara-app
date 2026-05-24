import { NextRequest, NextResponse } from 'next/server';

import { TARGET_EVENT } from './constants';
import { logger, safeJsonParse } from './helpers';
import {
  createWebhookEvent,
  updateWebhookEvent,
} from './repositories/webhookEventRepository';
import { processRetellWebhook } from './services/processRetellWebhook';
import { verifyWebhookSignature } from './services/verifyWebhookSignature';
import {
  RetellCallEndedBusinessSchema,
  RetellWebhookSchema,
} from './zod/schema';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-retell-signature');
  const headers = Object.fromEntries(req.headers.entries());

  let webhookEvent: Awaited<ReturnType<typeof createWebhookEvent>> | null =
    null;

  try {
    if (!signature) {
      return NextResponse.json(
        {
          error: 'Missing signature',
        },
        {
          status: 401,
        },
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid signature',
        },
        {
          status: 401,
        },
      );
    }

    const parsedJson = safeJsonParse(rawBody);

    if (!parsedJson) {
      return NextResponse.json(
        {
          error: 'Invalid JSON',
        },
        {
          status: 400,
        },
      );
    }

    const parsed = RetellWebhookSchema.safeParse(parsedJson);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
        },
        {
          status: 400,
        },
      );
    }

    const body = parsed.data;

    if (body.event !== TARGET_EVENT) {
      return NextResponse.json({
        ignored: true,
      });
    }

    webhookEvent = await createWebhookEvent({
      provider: 'retell',
      rawBody,
      signature,
      headers,
      payload: body,
      eventType: body.event,
      externalEventId: body.call.call_id,
      status: 'PENDING',
    });

    const businessPayload = RetellCallEndedBusinessSchema.safeParse(body);

    if (!businessPayload.success) {
      await updateWebhookEvent(webhookEvent.id, {
        status: 'FAILED',
        responseStatus: 400,
        lastError: JSON.stringify(businessPayload.error.flatten()),
      });

      return NextResponse.json(
        {
          error: 'Missing business-critical fields',
        },
        {
          status: 400,
        },
      );
    }

    await processRetellWebhook(businessPayload.data, webhookEvent.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown webhook error';

    logger.error('Retell webhook failed', {
      error: message,
      webhookEventId: webhookEvent?.id,
    });

    if (webhookEvent) {
      await updateWebhookEvent(webhookEvent.id, {
        status: 'FAILED',
        responseStatus: 500,
        retryCountIncrement: true,
        lastError: message,
      });
    }

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
      },
      {
        status: 500,
      },
    );
  }
}
