'use server';

import { z } from 'zod';

import { completeSignupSchema } from '../../utils/zod/schema';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { setNewPassword } from '@/features/auth/set-password/server/db/setNewPassword';
import { mapResetError } from '@/features/auth/set-password/utils/helpers';

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

    const result = await setNewPassword({
      token,
      password,
    });

    if (!result.success) {
      // Return an error object if the password reset fails
      return {
        error: mapResetError(result.reason),
      };
    }

    // Create a new user session
    const sessionToken = generateSessionToken();
    const session = await createUserSession(
      sessionToken,
      result.userId,
      result.apiKey,
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
