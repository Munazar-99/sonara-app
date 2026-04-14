import { Session } from '.prisma/client';
import { redis } from '@/lib/upstash/upstash';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { updateLastActive } from './updateLastActive';

export async function createUserSession(
  token: string,
  userId: string,
  retellApiKey?: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1),
  };
  await redis.set(
    `session:${session.id}`,
    JSON.stringify({
      id: session.id,
      user_id: session.userId,
      expires_at: Math.floor(session.expiresAt.getTime() / 1000),
      retell_api_key: retellApiKey,
    }),
    {
      exat: Math.floor(session.expiresAt.getTime() / 1000),
    },
  );
  await redis.sadd(`user_sessions:${userId}`, sessionId);
  await updateLastActive(userId);

  return session;
}
