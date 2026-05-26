'use server';

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/upstash/upstash';
import { headers } from 'next/headers';
import { signInSchema } from '../../utils/zod/schema';
import { getUserByEmail } from '@/server/db/auth/getUserByEmail';
import { verifyPassword } from '@/utils/auth/hashPassword';
import { setSession } from '@/utils/auth/setSession';

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60s'),
});

const emailRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '300s'),
});

export async function loginAction(
  formData: unknown,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const forwardedFor = (await headers()).get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ?? 'unknown-ip';
    const { success: isAllowed } = await rateLimit.limit(ip);
    if (!isAllowed) {
      return { error: 'Too many requests. Please wait a minute.' };
    }

    // Validate input safely
    const parsedData = signInSchema.safeParse(formData);
    if (!parsedData.success) {
      return { error: 'Invalid input. Please check your email and password.' };
    }

    const { email, password } = parsedData.data;
    const { success: isEmailAllowed } = await emailRateLimit.limit(
      `login:${email}`,
    );

    if (!isEmailAllowed) {
      return { error: 'Too many requests. Please wait a few minutes.' };
    }

    const existingUser = await getUserByEmail(email);
    const invalidCredentials = {
      error: 'Invalid credentials. Please try again.',
    };

    if (!existingUser?.passwordHash) {
      return invalidCredentials;
    }

    if (existingUser.status !== 'active') return invalidCredentials;

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.passwordHash,
    );

    if (!isPasswordValid) {
      return invalidCredentials;
    }

    await setSession(existingUser.id, existingUser.apiKey);

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
