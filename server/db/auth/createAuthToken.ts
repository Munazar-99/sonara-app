import prisma from '@/lib/prisma/prisma';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { AuthToken, AuthTokenType } from '@prisma/client';

export async function createAuthToken(
  token: string,
  userId: string,
  email: string,
  type: AuthTokenType,
): Promise<AuthToken> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  const authTokenRecord = await prisma.authToken.create({
    data: {
      id: sessionId,
      userId,
      email,
      expiresAt,
      type,
    },
  });

  return authTokenRecord;
}
