'use server';

import { z } from 'zod';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { isWithinExpirationDate } from 'oslo';

import { getSignupTokenById } from '../db/getSignupTokenById';
import { completeUserSignup } from '../db/completeUserSignup';
import { completeSignupSchema } from '../../utils/zod/schema';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { hashPassword } from '@/utils/auth/hashPassword';

export async function completeSignupAction(
  token: string,
  formData: z.infer<typeof completeSignupSchema>,
): Promise<{ error?: string; success?: boolean }> {
  try {
    // Validate form data
    const validationResult = completeSignupSchema.safeParse(formData);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    const { password } = validationResult.data;

    // Generate session ID from token
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    // Retrieve the signup token from the database
    const tokenRecord = await getSignupTokenById(sessionId);
    if (!tokenRecord || !isWithinExpirationDate(tokenRecord.expiresAt)) {
      return {
        error:
          'Invalid or expired signup link. Please request a new invitation.',
      };
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Complete signup: set password, update status, and delete the token
    const user = await completeUserSignup(
      tokenRecord.userId,
      passwordHash,
      tokenRecord.id,
    );

    // Create a new user session
    const sessionToken = generateSessionToken();
    const session = await createUserSession(
      sessionToken,
      tokenRecord.userId,
      user.apiKey,
    );

    // Set session token as an HTTP-only cookie
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return { success: true };
  } catch (error) {
    console.error('Complete signup error:', error);
    return {
      error: 'An error occurred while completing signup. Please try again.',
    };
  }
}
