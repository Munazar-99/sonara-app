'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { User } from '../types';
import { EditUserFormValues } from '../utils/schema';
import { EditUserForm } from './EditUserForm';
import {
  dialogContentClass,
  dialogDescriptionClass,
  dialogHeaderClass,
  dialogIconClass,
  dialogTitleClass,
} from './user-dialog-styles';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditUser: (user: User, data: EditUserFormValues) => Promise<void>;
  isPending: boolean;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onEditUser,
  isPending,
}: EditUserDialogProps) {
  if (!user) return null;

  const handleSubmit = async (data: EditUserFormValues) => {
    await onEditUser(user, data);
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
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className={dialogTitleClass}>Edit user</DialogTitle>
              <DialogDescription className={dialogDescriptionClass}>
                Update workspace access, billing, and account status.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          <EditUserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
