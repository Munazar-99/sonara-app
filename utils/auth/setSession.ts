import { UserId } from '@/types/auth/type';
import { generateSessionToken } from './generateSessionToken';
import { setSessionTokenCookie } from './setSessionTokenCookie';
import { createUserSession } from '@/server/db/auth/createUserSession';
import { invalidateSession } from '@/server/db/auth/invalidateSession';

export async function setSession(userId: UserId, retellApiKey?: string) {
  const token = generateSessionToken();
  const session = await createUserSession(token, userId, retellApiKey);

  try {
    await setSessionTokenCookie(token, session.expiresAt);
  } catch (error) {
    await invalidateSession(session.id, userId);

    throw error;
  }
}
