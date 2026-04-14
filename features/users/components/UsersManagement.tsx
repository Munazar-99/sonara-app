'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BillingRate, User } from '../types';
import { AddUserFormValues, EditUserFormValues } from '../utils/schema';
import { UserTable } from './UserTable';
import { AddUserDialog } from './AddUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useAddUser } from '../hooks/useAddUser';

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
          const fullUser: User = {
            ...res.data,
            name: res.data.name ?? 'Pending', // Provide default values
            minutesUsed: 0,
            callsMade: 0,
            createdAt: res.data.createdAt.toISOString(),
            lastActive: res.data.lastActive
              ? res.data.lastActive.toISOString()
              : new Date().toISOString(),
            apiKey: res.data.apiKey ?? undefined, // Ensure apiKey is string or undefined
            billingRate: (res.data.billingRate as BillingRate) ?? undefined, // Ensure billingRate is of type BillingRate
          };
          setUsers(prevUsers => [...prevUsers, fullUser]);
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
              ? { ...u, ...formData, billingRate: u.billingRate }
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
    // In a real application, this would trigger an API call to resend the invitation
    console.log('Resending invitation to:', user.email);
  };

  const handleSuspendUser = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id ? { ...u, status: 'suspended' } : u,
      ),
    );
  };

  const handleReactivateUser = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === user.id ? { ...u, status: 'active' } : u)),
    );
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 md:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your organization&#39;s users
          </p>
        </div>
        <Button
          onClick={() => setShowAddUser(true)}
          className="w-full shadow-sm md:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-gray-dark">
        <CardContent className="p-0">
          <UserTable
            users={users}
            onViewDetails={handleViewDetails}
            onEditUser={handleEditUser}
            onResendInvite={handleResendInvite}
            onSuspendUser={handleSuspendUser}
            onReactivateUser={handleReactivateUser}
          />
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
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
