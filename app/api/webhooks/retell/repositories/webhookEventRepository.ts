// repositories/webhookEventRepository.ts

import prisma from '@/lib/prisma/prisma';

import { WebhookEventStatus } from '@prisma/client';

export async function createWebhookEvent(data: {
  provider: string;

  rawBody: string;

  signature?: string | null;

  headers: Record<string, string>;

  status?: WebhookEventStatus;

  eventType?: string;

  externalEventId?: string;

  payload?: unknown;
}) {
  return prisma.webhookEvent.create({
    data: {
      provider: data.provider,

      rawBody: data.rawBody,

      signature: data.signature ?? null,

      headers: data.headers,

      status: data.status ?? 'PENDING',

      eventType: data.eventType,

      externalEventId: data.externalEventId,

      payload: data.payload as object,
    },
  });
}

export async function updateWebhookEvent(
  id: string,
  data: Partial<{
    status: WebhookEventStatus;

    eventType: string;

    externalEventId: string;

    payload: unknown;

    responseStatus: number;

    lastError: string;

    processedAt: Date;

    retryCountIncrement: boolean;
  }>,
) {
  return prisma.webhookEvent.update({
    where: { id },

    data: {
      status: data.status,

      eventType: data.eventType,

      externalEventId: data.externalEventId,

      payload: data.payload as object,

      responseStatus: data.responseStatus,

      lastError: data.lastError,

      processedAt: data.processedAt,

      retryCount: data.retryCountIncrement
        ? {
            increment: 1,
          }
        : undefined,
    },
  });
}
