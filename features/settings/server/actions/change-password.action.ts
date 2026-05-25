'use server';

import { getUserByEmail } from '@/server/db/auth/getUserByEmail';
import { getCurrentUser } from '@/utils/auth/getCurrentUser';
import { verifyPassword } from '@/utils/auth/hashPassword';
import { securityFormSchema } from '../../utils/schema';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { updatePassword } from '../db/updatePassword';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

async function validateUser(): Promise<{ email: string; id: string }> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

async function verifyOldPassword(
  userEmail: string,
  oldPassword: string,
): Promise<{ userId: string; oldHash: string }> {
  const existingUser = await getUserByEmail(userEmail);
  if (!existingUser?.passwordHash) throw new Error('Invalid credentials');

  const isOldPasswordCorrect = await verifyPassword(
    oldPassword,
    existingUser.passwordHash,
  );
  if (!isOldPasswordCorrect) throw new Error('Invalid credentials');

  return { userId: existingUser.id, oldHash: existingUser.passwordHash };
}

export default async function changePasswordAction(
  formData: z.infer<typeof securityFormSchema>,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const validatedData = securityFormSchema.parse(formData);
    const user = await validateUser();
    const { userId, oldHash } = await verifyOldPassword(
      user.email,
      validatedData.oldPassword,
    );
    await updatePassword(userId, validatedData.newPassword, oldHash);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      console.warn('Redirect error occurred: ', error);
    }
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input' };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}
