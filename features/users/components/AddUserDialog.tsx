'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { AddUserFormValues } from '../utils/schema';
import { AddUserForm } from './AddUserForm';
import {
  dialogContentClass,
  dialogDescriptionClass,
  dialogHeaderClass,
  dialogIconClass,
  dialogTitleClass,
} from './user-dialog-styles';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (data: AddUserFormValues) => void;
  isPending: boolean;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onAddUser,
  isPending,
}: AddUserDialogProps) {
  const handleSubmit = (data: AddUserFormValues) => {
    onAddUser(data);
    // onOpenChange(false)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${dialogContentClass} max-h-[90vh] overflow-y-auto sm:max-w-[640px]`}
      >
        <DialogHeader className={dialogHeaderClass}>
          <div className="flex items-start gap-3">
            <div className={dialogIconClass}>
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className={dialogTitleClass}>Add user</DialogTitle>
              <DialogDescription className={dialogDescriptionClass}>
                Create a workspace user and send an invitation to finish account
                setup.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <AddUserForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
