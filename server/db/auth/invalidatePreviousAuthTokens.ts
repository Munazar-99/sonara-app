import prisma from '@/lib/prisma/prisma';

export const invalidatePreviousAuthTokens = async (
  userId: string,
): Promise<void> => {
  await prisma.authToken.updateMany({
    where: {
      userId,
      type: 'PASSWORD_RESET',
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      usedAt: new Date(),
    },
  });
};
