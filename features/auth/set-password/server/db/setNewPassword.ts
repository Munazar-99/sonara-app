import prisma from '@/lib/prisma/prisma';

import { hashPassword } from '@/utils/auth/hashPassword';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

import { isWithinExpirationDate } from 'oslo';
import {
  ResetPasswordInput,
  ResetPasswordResult,
} from '../../utils/types/type';

/**
 * This function resets a user's password in the database.
 * It first hashes the password and then finds the corresponding authentication token using the hashed token.
 * If the token is expired or invalid, it returns an error.
 * If the token is valid, it updates the user's password in the database and deletes the authentication token.
 * @param resetPasswordInput - An object containing the reset password token and the new password.
 * @returns A promise that resolves to a `ResetPasswordResult` object with a success flag and an optional error message.
 */

export async function setNewPassword({
  token,
  password,
  expectedType,
}: ResetPasswordInput): Promise<ResetPasswordResult> {
  const hashedToken = hashToken(token);

  const passwordHash = await hashPassword(password);

  return prisma.$transaction(async tx => {
    // Find the authentication token using the hashed token

    const tokenRecord = await tx.authToken.findUnique({
      where: {
        id: hashedToken,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
        type: true,

        user: {
          select: {
            apiKey: true,
            status: true,
          },
        },
      },
    });
    // If the token is expired or invalid, return an error

    if (!tokenRecord) {
      return {
        success: false,
        reason: 'NOT_FOUND',
      };
    }

    if (tokenRecord.type !== expectedType) {
      return {
        success: false,
        reason: 'NOT_FOUND',
      };
    }

    if (!isWithinExpirationDate(tokenRecord.expiresAt)) {
      return {
        success: false,
        reason: 'EXPIRED',
      };
    }

    if (tokenRecord.usedAt) {
      return {
        success: false,
        reason: 'ALREADY_USED',
      };
    }

    if (
      expectedType === 'PASSWORD_RESET' &&
      tokenRecord.user.status !== 'active'
    ) {
      return {
        success: false,
        reason: 'NOT_FOUND',
      };
    }

    const consumedToken = await tx.authToken.updateMany({
      where: {
        id: tokenRecord.id,
        type: expectedType,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        usedAt: new Date(),
      },
    });

    if (consumedToken.count !== 1) {
      return {
        success: false,
        reason: 'ALREADY_USED',
      };
    }

    await tx.user.update({
      where: {
        id: tokenRecord.userId,
      },
      data: {
        passwordHash,
        status: expectedType === 'INVITE' ? 'active' : undefined,
      },
    });

    return {
      success: true,
      userId: tokenRecord.userId,
      apiKey: tokenRecord.user.apiKey,
    };
  });
}

function hashToken(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
