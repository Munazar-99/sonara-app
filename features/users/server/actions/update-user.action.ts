'use server';

import { z } from 'zod';
import { updateUser } from '../db/updateUser';
import { updateUserSchema } from '../../utils/schema';
import { encrypt } from '../../utils/crypto';

// Define Zod schema for validation

export async function updateUserAction(
  formData: z.infer<typeof updateUserSchema>,
) {
  // Validate data using Zod
  const parsedData = updateUserSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: parsedData.error.errors };
  }

  try {
    await updateUser({
      ...parsedData.data,
      apiKey: encrypt(parsedData.data.apiKey),
    });
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
