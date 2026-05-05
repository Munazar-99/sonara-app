'use server';

import { z } from 'zod';

import { passwordSchema } from '../../utils/zod/schema';

import { createUserSession } from '@/server/db/auth/createUserSession';

import { generateSessionToken } from '@/utils/auth/generateSessionToken';
import { setSessionTokenCookie } from '@/utils/auth/setSessionTokenCookie';
import { resetPassword } from '../db/resetPassword';

type SetPasswordResponse = {
  success?: boolean;
  error?: string;
};

/**
 * This function handles the password reset process. It first validates the input data, then calls the `resetPassword` function to reset the user's password.
 * If the password reset is successful, it generates a session token and creates a new user session in the database. It then sets the session token in a cookie.
 * The function returns an object with a `success` property if the password reset is successful, or an `error` property with an error message if there is an error.
 * @param token - The reset password token.
 * @param formData - An object containing the new password and any other required fields.
 * @returns An object with a `success` property if the password reset is successful, or an `error` property with an error message if there is an error.
 */
export async function setPasswordAction(
  token: string,
  formData: z.infer<typeof passwordSchema>,
): Promise<SetPasswordResponse> {
  try {
    // Validate the input data
    const parsed = passwordSchema.safeParse(formData);

    if (!parsed.success) {
      // Return an error object if the input data is invalid
      return {
        error: parsed.error.errors[0]?.message,
      };
    }

    // Call the `resetPassword` function to reset the user's password
    const result = await resetPassword({
      token,
      password: parsed.data.newPassword,
    });

    if (!result.success) {
      // Return an error object if the password reset fails
      return {
        error: mapResetError(result.reason),
      };
    }

    // Generate a session token
    const sessionToken = generateSessionToken();

    // Create a new user session in the database
    const session = await createUserSession(
      sessionToken,
      result.userId,
      result.apiKey,
    );

    // Set the session token in a cookie
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    // Return a success object
    return {
      success: true,
    };
  } catch (error) {
    // Log any errors and return an error object
    console.error('setPasswordAction:', error);

    return {
      error: 'Something went wrong while resetting your password.',
    };
  }
}

function mapResetError(
  reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED',
): string {
  switch (reason) {
    case 'NOT_FOUND':
      return 'Invalid reset link.';

    case 'EXPIRED':
      return 'Reset link has expired.';

    case 'ALREADY_USED':
      return 'Reset link has already been used.';
  }
}
