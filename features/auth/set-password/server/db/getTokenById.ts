import prisma from '@/lib/prisma/prisma';

export const getTokenById = async (id: string) => {
  const tokenRecord = await prisma.passwordResetSession.findUnique({
    where: { id },
    select: { user: true, expiresAt: true, id: true, userId: true },
  });
  return tokenRecord;
};
