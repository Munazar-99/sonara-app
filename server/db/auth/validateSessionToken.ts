import { redis } from '@/lib/upstash/upstash';
import { SessionData } from '@/types/auth/type';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export async function validateSessionToken(
  token: string,
): Promise<SessionData | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const item = await redis.get<SessionData>(`session:${sessionId}`);
  if (!item) return null;

  const now = Date.now();
  const expiresAtMs = item.expires_at * 1000;

  // Session expired
  if (now >= expiresAtMs) {
    await redis.del(`session:${sessionId}`);
    await redis.srem(`user_sessions:${item.user_id}`, sessionId);
    return null;
  }

  const tenMinutesInMs = 1000 * 60 * 10;
  const oneHourInSeconds = 60 * 60;

  // If within last 10 minutes of expiration, extend by 1 hour
  if (now >= expiresAtMs - tenMinutesInMs) {
    const newExpiresAtUnix = Math.floor((now + oneHourInSeconds * 1000) / 1000);
    item.expires_at = newExpiresAtUnix;

    await redis.set(`session:${sessionId}`, JSON.stringify(item), {
      exat: newExpiresAtUnix,
    });
  }

  return item;
}
