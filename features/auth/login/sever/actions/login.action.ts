'use server';

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/upstash/upstash';
import { headers } from 'next/headers';
import { signInSchema } from '../../utils/zod/schema';
import { getUserByEmail } from '@/server/db/auth/getUserByEmail';
import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { hashPassword } from '@/utils/auth/hashPassword';

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

    if (!existingUser?.passwordHash) {
      return { error: 'Invalid credentials. Please try again.' };
    }

    // Securely hash and compare passwords
    const hash = await hashPassword(password);
    if (existingUser.passwordHash !== hash) {
      return { error: 'Invalid credentials. Please try again.' };
    }

    const token = generateSessionToken();
    const session = await createUserSession(
      token,
      existingUser.id,
      existingUser.apiKey,
    );
    await setSessionTokenCookie(token, session.expiresAt);

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
