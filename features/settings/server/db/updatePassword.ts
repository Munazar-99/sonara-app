import 'server-only';
import prisma from '@/lib/prisma/prisma';
import { hashPassword, verifyPassword } from '@/utils/auth/hashPassword';

export async function updatePassword(
  userId: string,
  newPassword: string,
  oldHash: string,
): Promise<void> {
  if (await verifyPassword(newPassword, oldHash)) {
    throw new Error('New password cannot be the same as the old password');
  }

  const newHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}
