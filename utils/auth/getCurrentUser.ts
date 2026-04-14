import { getUserById } from '@/server/db/auth/getUserById';
import { validateRequest } from '@/server/db/auth/validateRequest';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session || !('user_id' in session)) return null;

  return getUserById(session.user_id);
});
