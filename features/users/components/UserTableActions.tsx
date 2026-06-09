'use client';

import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '../types';
import { UserTableActionHandlers } from './user-table-types';

type UserTableActionsProps = UserTableActionHandlers & {
  user: User;
};

export function UserTableActions({
  user,
  onViewDetails,
  onEditUser,
  onResendInvite,
  onSuspendUser,
  onReactivateUser,
}: UserTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit user
        </DropdownMenuItem>
        {user.status === 'pending' && onResendInvite && (
          <DropdownMenuItem onClick={() => onResendInvite(user)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Resend invite
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {user.status === 'active' && onSuspendUser ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onSuspendUser(user)}
          >
            <Ban className="mr-2 h-4 w-4" />
            Suspend user
          </DropdownMenuItem>
        ) : user.status === 'suspended' && onReactivateUser ? (
          <DropdownMenuItem onClick={() => onReactivateUser(user)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Reactivate user
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
