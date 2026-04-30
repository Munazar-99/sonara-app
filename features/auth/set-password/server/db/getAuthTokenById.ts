import prisma from '@/lib/prisma/prisma';

export const getAuthTokenById = async (id: string) => {
  const tokenRecord = await prisma.authToken.findUnique({
    where: { id },
    select: { user: true, expiresAt: true, id: true, userId: true },
  });
  return tokenRecord;
};
