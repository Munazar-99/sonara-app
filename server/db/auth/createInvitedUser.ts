import prisma from '@/lib/prisma/prisma';

import { encrypt } from '@/features/users/utils/crypto';

import { generateToken } from '@/server/db/auth/generateToken';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

import { AUTH_TOKEN_TYPE } from '@/utils/constants/auth/constants';

import type { AddUserFormValues } from '@/features/users/utils/schema';
import { User } from '@prisma/client';

const INVITE_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

type CreateInvitedUserResult =
  | {
      success: true;
      invitationToken: string;
      user: Pick<
        User,
        | 'id'
        | 'name'
        | 'email'
        | 'role'
        | 'billingRate'
        | 'status'
        | 'createdAt'
        | 'lastActive'
      >;
    }
  | {
      success: false;
      reason: 'USER_ALREADY_EXISTS';
    };

export async function createInvitedUser(
  data: AddUserFormValues,
): Promise<CreateInvitedUserResult> {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: data.email,
        mode: 'insensitive',
      },
    },
  });

  if (existingUser) {
    return {
      success: false,
      reason: 'USER_ALREADY_EXISTS',
    };
  }

  const rawToken = generateToken();

  const hashedToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(rawToken)),
  );

  const expiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_MS);

  const encryptedApiKey = encrypt(data.apiKey);

  const user = await prisma.$transaction(async tx => {
    const createdUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        billingRate: data.billingRate,
        apiKey: encryptedApiKey,
        status: 'pending',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        billingRate: true,
        status: true,
        createdAt: true,
        lastActive: true,
      },
    });

    await tx.authToken.updateMany({
      where: {
        userId: createdUser.id,
        type: AUTH_TOKEN_TYPE.INVITE,
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
        id: hashedToken,
        userId: createdUser.id,
        email: createdUser.email,
        expiresAt,
        type: AUTH_TOKEN_TYPE.INVITE,
      },
    });

    return createdUser;
  });

  return {
    success: true,
    invitationToken: rawToken,
    user,
  };
}
