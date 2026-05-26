'use server';

import { z } from 'zod';

import { completeSignupSchema } from '../../utils/zod/schema';
import { setNewPassword } from '@/features/auth/set-password/server/db/setNewPassword';
import { mapInviteError } from '@/features/auth/set-password/utils/helpers';
import { setSession } from '@/utils/auth/setSession';

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
      expectedType: 'INVITE',
    });

    if (!result.success) {
      // Return an error object if the password reset fails
      return {
        error: mapInviteError(result.reason),
      };
    }

    await setSession(result.userId, result.apiKey);

    return { success: true };
  } catch (error) {
    console.error('Complete signup error:', error);
    return {
      error: 'An error occurred while completing signup. Please try again.',
    };
  }
}
