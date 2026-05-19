'use server';

import { decrypt } from '../../utils/crypto';
import { fetchUsers } from '../db/fetchallUsers';

/**
 * Handles fetching users and authenticated user info.
 */
export async function fetchAllUsersAction() {
  try {
    const users = await fetchUsers();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      minutesUsed: user.currentMonthCalls,
      callsMade: user.currentMonthMinutes,
      createdAt: user.createdAt.toISOString(),
      lastActive: user.lastActive?.toISOString(),
      billingRate: user.billingRate,
      currentSpend: user.currentMonthCost,
      apiKey: decrypt(user.apiKey!),
    }));
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    return { users: [] };
  }
}
