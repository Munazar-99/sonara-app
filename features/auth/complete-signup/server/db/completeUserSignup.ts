import prisma from '@/lib/prisma/prisma';
import { decrypt } from '@/features/users/utils/crypto';

export const completeUserSignup = async (
  userId: string,
  passwordHash: string,
  tokenId: string,
) => {
  const user = await prisma.$transaction(async tx => {
    // Update user with password and set status to active
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        status: 'active',
      },
    });

    // Delete the signup/invitation token
    await tx.passwordResetSession.delete({ where: { id: tokenId } });

    return updatedUser;
  });

  // Decrypt the API key for session creation
  const decryptedApiKey = decrypt(user.apiKey);

  return {
    ...user,
    apiKey: decryptedApiKey,
  };
};
