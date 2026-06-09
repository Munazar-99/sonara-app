import prisma from '@/lib/prisma/prisma';
import 'server-only';

/**
 * Fetches all users from the database.
 */
export async function fetchUsers() {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;

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
        monthlyUsage: {
          where: {
            year,
            month,
          },
          select: {
            totalCalls: true,
            totalDurationSec: true,
            totalProviderCost: true,
            totalCustomerCost: true,
            totalProfit: true,
          },
          take: 1,
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
