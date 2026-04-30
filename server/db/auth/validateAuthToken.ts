import { getTokenById } from '@/features/auth/set-password/server/db/getTokenById';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { User } from '@prisma/client';
import { isWithinExpirationDate } from 'oslo';

type ValidateAuthTokenResult =
  | { success: true; id: string; userId: string; user: User }
  | { success: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_USED' };

export async function validateAuthTokenRecord(
  token: string,
): Promise<ValidateAuthTokenResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const authTokenRecord = await getTokenById(sessionId);

  if (!authTokenRecord) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  if (!isWithinExpirationDate(authTokenRecord.expiresAt)) {
    return { success: false, reason: 'EXPIRED' };
  }

  // TODO: Check if token has already been used

  //   if (authTokenRecord.usedAt) {
  //     return { success: false, reason: 'ALREADY_USED' };
  //   }

  return {
    success: true,
    id: authTokenRecord.id,
    userId: authTokenRecord.userId,
    user: authTokenRecord.user,
  };
}
