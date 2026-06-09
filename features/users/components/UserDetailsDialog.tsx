'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Calendar,
  BarChart3,
  Shield,
  UserIcon,
  AlertTriangle,
} from 'lucide-react';
import { User } from '../types';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeStyles,
  timeAgo,
} from '../utils';
import {
  dialogContentClass,
  dialogDescriptionClass,
  dialogFooterClass,
  dialogHeaderClass,
  dialogIconClass,
  dialogMutedPanelClass,
  dialogPanelClass,
  dialogTitleClass,
  secondaryButtonClass,
} from './user-dialog-styles';

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResendInvite: (user: User) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onResendInvite,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${dialogContentClass} max-h-[90vh] overflow-y-auto sm:max-w-[680px]`}
      >
        <DialogHeader className={dialogHeaderClass}>
          <div className="flex items-start gap-3">
            <div className={dialogIconClass}>
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className={dialogTitleClass}>
                User profile
              </DialogTitle>
              <DialogDescription className={dialogDescriptionClass}>
                Review account state, access level, and current-month usage.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          <div className={dialogMutedPanelClass}>
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2 md:justify-end">
                <Badge className={getStatusBadgeStyles(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 border-slate-200 bg-white font-normal text-slate-700 dark:border-white/10 dark:bg-[#18202f] dark:text-slate-300"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Administrator</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                      <span>Standard User</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={dialogPanelClass}>
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                  <Calendar className="h-4 w-4 text-primary" />
                  Account Information
                </h3>
                <Separator />
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Member Since
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {formatDate(user.createdAt)}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Last Active
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {user.lastActive ? timeAgo(new Date(user.lastActive)) : '-'}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Status
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            <div className={dialogPanelClass}>
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Usage Summary
                </h3>
                <Separator />
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Minutes Used
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {Math.round(
                      user.currentMonthUsage.totalDurationSec / 60,
                    ).toLocaleString()}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Calls Made
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {user.currentMonthUsage.totalCalls.toLocaleString()}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Current Spend
                  </div>
                  <div className="text-sm font-medium text-slate-950 dark:text-white">
                    {formatCurrency(user.currentMonthUsage.totalCustomerCost)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.status === 'pending' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-400/15">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <h3 className="font-medium text-amber-900 dark:text-amber-200">
                    Invitation pending
                  </h3>
                  <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                    This user has not yet accepted their invitation sent{' '}
                    {timeAgo(new Date(user.createdAt))}.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-8 rounded-lg border-amber-200 bg-white text-amber-700 hover:bg-amber-100 dark:border-amber-400/20 dark:bg-[#111827] dark:text-amber-200 dark:hover:bg-amber-400/15"
                    onClick={() => onResendInvite(user)}
                  >
                    Resend invitation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className={dialogFooterClass}>
          <Button
            variant="outline"
            className={`${secondaryButtonClass} w-full sm:w-auto`}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
