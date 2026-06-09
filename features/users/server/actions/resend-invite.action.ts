'use server';

import prisma from '@/lib/prisma/prisma';
import { generateToken } from '@/server/db/auth/generateToken';
import { AUTH_TOKEN_TYPE } from '@/utils/constants/auth/constants';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sendInvitationEmail } from '../email/sendInvitationEmail';
import {
  mapAuthorizationError,
  requireUsersAdmin,
} from '../auth/require-users-admin';

const INVITE_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

export async function resendInviteAction(userId: string) {
  try {
    await requireUsersAdmin();

    const rawToken = generateToken();
    const tokenId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(rawToken)),
    );
    const expiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_MS);

    const user = await prisma.$transaction(async tx => {
      const pendingUser = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      });

      if (!pendingUser || pendingUser.status !== 'pending') {
        return null;
      }

      await tx.authToken.updateMany({
        where: {
          userId: pendingUser.id,
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
          id: tokenId,
          userId: pendingUser.id,
          email: pendingUser.email,
          expiresAt,
          type: AUTH_TOKEN_TYPE.INVITE,
        },
      });

      return pendingUser;
    });

    if (!user) {
      return {
        success: false,
        message: 'Invitation can only be resent to pending users.',
      };
    }

    const emailResult = await sendInvitationEmail(
      user.email,
      user.name,
      rawToken,
    );

    if (!emailResult.success) {
      return {
        success: false,
        message: 'Invitation token created, but email delivery failed.',
      };
    }

    return {
      success: true,
      message: 'Invitation resent successfully.',
    };
  } catch (error) {
    console.error('resendInviteAction:', error);
    const authorizationError = mapAuthorizationError(error);

    return {
      success: false,
      message: authorizationError ?? 'Failed to resend invitation.',
    };
  }
}
