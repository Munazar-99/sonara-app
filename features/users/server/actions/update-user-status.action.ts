'use server';

import prisma from '@/lib/prisma/prisma';
import { z } from 'zod';
import {
  mapAuthorizationError,
  requireUsersAdmin,
} from '../auth/require-users-admin';

const updateUserStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['active', 'pending', 'suspended']),
});

export async function updateUserStatusAction(
  input: z.infer<typeof updateUserStatusSchema>,
) {
  const parsed = updateUserStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid user status update.',
    };
  }

  try {
    const currentUser = await requireUsersAdmin();

    if (currentUser.id === parsed.data.id && parsed.data.status !== 'active') {
      return {
        success: false,
        message: 'You cannot deactivate your own account.',
      };
    }

    await prisma.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        status: parsed.data.status,
      },
    });

    return {
      success: true,
      message: 'User status updated.',
    };
  } catch (error) {
    console.error('updateUserStatusAction:', error);
    const authorizationError = mapAuthorizationError(error);

    return {
      success: false,
      message: authorizationError ?? 'Failed to update user status.',
    };
  }
}
