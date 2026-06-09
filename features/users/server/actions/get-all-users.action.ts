'use server';

import { decrypt } from '../../utils/crypto';
import { fetchUsers } from '../db/fetchallUsers';
import { requireUsersAdmin } from '../auth/require-users-admin';

/**
 * Handles fetching users and authenticated user info.
 */
export async function fetchAllUsersAction() {
  try {
    await requireUsersAdmin();

    const users = await fetchUsers();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      lastActive: user.lastActive?.toISOString() ?? null,
      billingRate: user.billingRate.toNumber(),
      apiKey: decrypt(user.apiKey!),
      currentMonthUsage: {
        totalCalls: user.monthlyUsage[0]?.totalCalls ?? 0,
        totalDurationSec: user.monthlyUsage[0]?.totalDurationSec ?? 0,
        totalProviderCost:
          user.monthlyUsage[0]?.totalProviderCost.toNumber() ?? 0,
        totalCustomerCost:
          user.monthlyUsage[0]?.totalCustomerCost.toNumber() ?? 0,
        totalProfit: user.monthlyUsage[0]?.totalProfit.toNumber() ?? 0,
      },
    }));
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    return [];
  }
}
