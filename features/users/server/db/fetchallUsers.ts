import prisma from '@/lib/prisma/prisma';
import 'server-only';

/**
 * Fetches all users from the database.
 */
export async function fetchUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        status: true,
        lastActive: true,
        billingRate: true,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
