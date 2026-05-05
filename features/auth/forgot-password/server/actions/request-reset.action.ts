'use server';

import { headers } from 'next/headers';

import { emailSchema } from '../../utils/zod/schema';

import type { EmailFormValues } from '../../utils/types/type';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/upstash/upstash';
import { requestPasswordReset } from '../db/requestPasswordReset';

type RequestResetResponse = {
  success?: boolean;
  error?: string;
};

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '60s'),
});

export async function requestResetAction(
  formData: EmailFormValues,
): Promise<RequestResetResponse> {
  try {
    const forwardedFor = (await headers()).get('x-forwarded-for');

    const ip = forwardedFor?.split(',')[0]?.trim() ?? 'unknown-ip';
    const { success: withinLimit } = await rateLimit.limit(ip);
    if (!withinLimit) {
      return { error: 'Too many requests. Please wait 1 minute.' };
    }

    const parsed = emailSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        error: 'Invalid email address.',
      };
    }

    await requestPasswordReset(parsed.data.email);

    return {
      success: true,
    };
  } catch (error) {
    console.error('requestResetAction:', error);

    return {
      error: 'Something went wrong. Please try again later.',
    };
  }
}
