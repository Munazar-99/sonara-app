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
import { Card, CardContent } from '@/components/ui/card';
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
import { formatDate, timeAgo } from '../utils';

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[600px]">
        <DialogHeader className="px-6 pb-2 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                User Profile
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                View and manage user details and settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-0 space-y-5 px-6 pb-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 md:items-end">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 font-normal"
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
            <Card>
              <CardContent className="space-y-3 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Account Information
                </h3>
                <Separator />
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-muted-foreground">
                    Member Since
                  </div>
                  <div className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Last Active
                  </div>
                  <div className="text-sm font-medium">
                    {user.lastActive ? timeAgo(new Date(user.lastActive)) : '-'}
                  </div>

                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="text-sm font-medium">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-4">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                  Usage Summary
                </h3>
                <Separator />
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-muted-foreground">
                    Minutes Used
                  </div>
                  {/* <div className="text-sm font-medium">{user.minutesUsed}</div> */}

                  <div className="text-sm text-muted-foreground">
                    Calls Made
                  </div>
                  {/* <div className="text-sm font-medium">{user.callsMade}</div> */}

                  <div className="text-sm text-muted-foreground">
                    Current Spend
                  </div>
                  <div className="text-sm font-medium">
                    {/* {formatCurrency(user.currentSpend)} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {user.status === 'pending' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 p-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">
                      Invitation Pending
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      This user has not yet accepted their invitation sent{' '}
                      {timeAgo(new Date(user.createdAt))}.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-8 border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                    >
                      Resend Invitation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-center border-t px-6 py-4">
          <Button
            className="w-full sm:w-[200px]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
