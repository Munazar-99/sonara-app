'use server';

import { z } from 'zod';

import { passwordSchema } from '../../utils/zod/schema';

import { setSession } from '@/utils/auth/setSession';
import { mapResetError } from '../../utils/helpers';
import { setNewPassword } from '../db/setNewPassword';

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
    const result = await setNewPassword({
      token,
      password: parsed.data.newPassword,
      expectedType: 'PASSWORD_RESET',
    });

    if (!result.success) {
      // Return an error object if the password reset fails
      return {
        error: mapResetError(result.reason),
      };
    }

    await setSession(result.userId, result.apiKey);

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
