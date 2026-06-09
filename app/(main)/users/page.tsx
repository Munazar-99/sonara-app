import { UsersManagement } from '@/features/users/components/UsersManagement';
import { ContentLayout } from '@/components/main/admin-panel/content-layout';
import { fetchAllUsersAction } from '@/features/users/server/actions/get-all-users.action';
import { User } from '@/features/users/types';

export default async function UsersPage() {
  const allUsers = (await fetchAllUsersAction()) satisfies User[];

  return (
    <ContentLayout title="Users">
      <UsersManagement initialUsers={allUsers} />
    </ContentLayout>
  );
}
