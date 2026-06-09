'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillingRate, User } from '../types';
import { AddUserFormValues, EditUserFormValues } from '../utils/schema';
import { UserTable } from './UserTable';
import { AddUserDialog } from './AddUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useAddUser } from '../hooks/useAddUser';
import { useResendInvite } from '../hooks/useResendInvite';
import { useUpdateUserStatus } from '../hooks/useUpdateUserStatus';
import { UserStatus } from '@prisma/client';
import { UsersMetricGrid } from './UsersMetricGrid';

interface UsersManagementClientProps {
  initialUsers: User[];
}

export function UsersManagement({ initialUsers }: UsersManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { mutate: addUser, isPending: isAddPending } = useAddUser();
  const { mutate: resendInvite } = useResendInvite();
  const { mutate: updateUserStatus } = useUpdateUserStatus();

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
  };

  const handleAddUser = (formData: AddUserFormValues) => {
    // Call mutation to add the user in the database
    addUser(formData, {
      onSuccess: res => {
        if (res?.data) {
          const createdUser: User = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            status: res.data.status,

            createdAt: res.data.createdAt.toISOString(),
            lastActive: res.data.lastActive?.toISOString() || null,

            billingRate: Number(res.data.billingRate) as BillingRate,
            currentMonthUsage: {
              totalCalls: 0,
              totalDurationSec: 0,
              totalProviderCost: 0,
              totalCustomerCost: 0,
              totalProfit: 0,
            },
          };

          setUsers(prev => [...prev, createdUser]);

          setShowAddUser(false);
        }
      },
      onError: () => {
        // Rollback UI state if mutation fails
        setUsers(prevUsers => [...prevUsers]); // Reset to previous state
      },
    });
  };

  const handleEditUserSubmit = async (
    user: User,
    formData: EditUserFormValues,
  ) => {
    // Extract only the fields that need updating
    const updatedUserData = {
      id: user.id, // Ensure we send the correct user ID
      ...formData,
    };

    // Call mutation to update the user in the database
    updateUser(updatedUserData, {
      onSuccess: () => {
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id
              ? {
                  ...u,
                  ...formData,
                  billingRate: formData.billingRate as BillingRate,
                }
              : u,
          ),
        );
        setUserToEdit(null);
      },
      onError: () => {
        // Rollback UI state if mutation fails
        setUsers(prevUsers => [...prevUsers]); // Reset to previous state
      },
    });
  };

  const handleResendInvite = (user: User) => {
    resendInvite(user.id);
  };

  const handleSuspendUser = (user: User) => {
    updateStatus(user, 'suspended');
  };

  const handleReactivateUser = (user: User) => {
    updateStatus(user, 'active');
  };

  const updateStatus = (user: User, status: UserStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === user.id ? { ...u, status } : u)),
    );

    updateUserStatus(
      {
        id: user.id,
        status,
      },
      {
        onError: () => {
          setUsers(prevUsers =>
            prevUsers.map(u =>
              u.id === user.id ? { ...u, status: user.status } : u,
            ),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Team management</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
            Users
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage access, invitation state, and current-month usage for your
            workspace.
          </p>
        </div>
        <Button
          onClick={() => setShowAddUser(true)}
          className="h-10 w-full rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90 md:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersMetricGrid users={users} />

      <UserTable
        users={users}
        onViewDetails={handleViewDetails}
        onEditUser={handleEditUser}
        onResendInvite={handleResendInvite}
        onSuspendUser={handleSuspendUser}
        onReactivateUser={handleReactivateUser}
      />

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
          onResendInvite={handleResendInvite}
        />
      )}

      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onAddUser={handleAddUser}
        isPending={isAddPending}
      />

      {userToEdit && (
        <EditUserDialog
          user={userToEdit}
          open={!!userToEdit}
          onOpenChange={() => setUserToEdit(null)}
          onEditUser={handleEditUserSubmit}
          isPending={isUpdatePending}
        />
      )}
    </div>
  );
}
