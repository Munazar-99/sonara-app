import prisma from '@/lib/prisma/prisma';

import { getUserByEmail } from '@/server/db/auth/getUserByEmail';

import { AUTH_TOKEN_TYPE } from '@/utils/constants/auth/constants';

import { generateToken } from '@/server/db/auth/generateToken';
import { sendResetLinkEmail } from '@/server/email/sendResetLinkEmail';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

const RESET_TOKEN_EXPIRY_MS = 1000 * 60 * 10;

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await getUserByEmail(email);

  // Prevent user enumeration
  if (!user) {
    await fakeDelay();
    return;
  }

  const rawToken = generateToken();

  const tokenId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(rawToken)),
  );

  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await prisma.$transaction(async tx => {
    await tx.authToken.updateMany({
      where: {
        userId: user.id,
        type: AUTH_TOKEN_TYPE.PASSWORD_RESET,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        usedAt: new Date(),
      },
    });

    await tx.authToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        email: user.email,
        expiresAt,
        type: AUTH_TOKEN_TYPE.PASSWORD_RESET,
      },
    });
  });

  await sendResetLinkEmail(user.email, rawToken, user.name ?? '');
}

async function fakeDelay(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1500));
}
