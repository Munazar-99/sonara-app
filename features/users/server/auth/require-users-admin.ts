import { getCurrentUser } from '@/utils/auth/getCurrentUser';
import 'server-only';

export async function requireUsersAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin' || user.status !== 'active') {
    throw new Error('UNAUTHORIZED');
  }

  return user;
}

export function mapAuthorizationError(error: unknown) {
  if (error instanceof Error && error.message === 'UNAUTHORIZED') {
    return 'You do not have permission to manage users.';
  }

  return null;
}
