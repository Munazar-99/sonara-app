'use server';

import { invalidateSession } from '@/server/db/auth/invalidateSession';
import { validateRequest } from '@/server/db/auth/validateRequest';
import { deleteSessionTokenCookie } from '@/utils/auth/deleteSessionTokenCookie';
import { redirect } from 'next/navigation';

export async function logOut(): Promise<{ error?: string; success?: boolean }> {
  try {
    const session = await validateRequest();

    if (!session || !('user_id' in session)) {
      console.warn('Invalid or missing session. Redirecting to login.');
      redirect('/login');
    }

    await Promise.all([
      invalidateSession(session.id, session.user_id),
      deleteSessionTokenCookie(),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: 'An error occurred during logout. Please try again.' };
  }
}
