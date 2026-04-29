'use server';

import { z } from 'zod';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { isWithinExpirationDate } from 'oslo';

import { getTokenById } from '../db/getTokenById';
import { deleteUserPasswordResetSessionAndSetNewPassword } from '../db/setPassword';
import { passwordSchema } from '../../utils/zod/schema';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { hashPassword } from '@/utils/auth/hashPassword';

export async function setPasswordAction(
  token: string,
  formData: z.infer<typeof passwordSchema>,
): Promise<{ error?: string; success?: boolean }> {
  try {
    // Validate form data
    const validationResult = passwordSchema.safeParse(formData);
    if (!validationResult.success) {
      return { error: validationResult.error.errors[0].message };
    }

    const { newPassword } = validationResult.data;

    // Generate session ID from token
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    // Retrieve the password reset token from the database
    const tokenRecord = await getTokenById(sessionId);
    if (!tokenRecord || !isWithinExpirationDate(tokenRecord.expiresAt)) {
      return { error: 'Invalid or expired token.' };
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Perform atomic transaction: update password and delete reset session
    await deleteUserPasswordResetSessionAndSetNewPassword(
      tokenRecord.userId,
      passwordHash,
      tokenRecord.id,
    );

    // Create a new user session
    const sessionToken = generateSessionToken();
    const session = await createUserSession(
      sessionToken,
      tokenRecord.userId,
      tokenRecord.user.apiKey,
    );

    // Set session token as an HTTP-only cookie
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      error:
        'An error occurred while resetting the password. Please try again.',
    };
  }
}
