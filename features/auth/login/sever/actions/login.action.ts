'use server';

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/upstash/upstash';
import { headers } from 'next/headers';
import { signInSchema } from '../../utils/zod/schema';
import { getUserByEmail } from '@/server/db/auth/getUserByEmail';
import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { verifyPassword } from '@/utils/auth/hashPassword';
import { invalidateSession } from '@/server/db/auth/invalidateSession';

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60s'),
});

export async function loginAction(
  formData: unknown,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const ip = (await headers()).get('x-forwarded-for') ?? 'unknown-ip';
    const { success: isAllowed } = await rateLimit.limit(ip);
    if (!isAllowed) {
      return { error: 'Too many requests. Please wait a minutes.' };
    }

    // Validate input safely
    const parsedData = signInSchema.safeParse(formData);
    if (!parsedData.success) {
      return { error: 'Invalid input. Please check your email and password.' };
    }

    const { email, password } = parsedData.data;
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

    const token = generateSessionToken();
    const session = await createUserSession(
      token,
      existingUser.id,
      existingUser.apiKey,
    );

    try {
      await setSessionTokenCookie(token, session.expiresAt);
    } catch (error) {
      await invalidateSession(session.id, existingUser.id);

      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
