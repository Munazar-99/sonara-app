'use client';

import { ArrowUpDown, Shield, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '../types';
import { formatCurrency, getStatusBadgeStyles, timeAgo } from '../utils';
import { UserStatus } from '@prisma/client';
import { UserSortField } from './user-table-types';

export const userColumnWidths = [
  '18rem',
  '9.5rem',
  '9.5rem',
  '9.5rem',
  '9.5rem',
  '9.5rem',
  '10rem',
  '5rem',
] as const;

export const userTableMinWidth = '90rem';

export function UserCell({ user }: { user: User }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/15">
        {getInitials(user.name)}
      </div>
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-950 dark:text-white">
          {user.name}
        </div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
          {user.email}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge className={getStatusBadgeStyles(status)}>
      {formatLabel(status)}
    </Badge>
  );
}

export function RoleBadge({ user }: { user: User }) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-slate-200 bg-white font-normal text-slate-700 dark:border-white/10 dark:bg-[#131a2b] dark:text-slate-300"
    >
      {user.role === 'admin' ? (
        <Shield className="h-3.5 w-3.5 text-primary" />
      ) : (
        <UserRound className="h-3.5 w-3.5 text-slate-400" />
      )}
      {formatLabel(user.role)}
    </Badge>
  );
}

export function UsageCell({ user }: { user: User }) {
  return (
    <div className="text-right">
      <div className="font-medium text-slate-950 dark:text-white">
        {formatMinutes(user.currentMonthUsage.totalDurationSec)}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {user.currentMonthUsage.totalCalls.toLocaleString()} calls
      </div>
    </div>
  );
}

export function MoneyCell({ value }: { value: number }) {
  return (
    <div className="text-right font-medium text-slate-950 dark:text-white">
      {formatCurrency(value)}
    </div>
  );
}

export function LastActiveCell({ user }: { user: User }) {
  return (
    <span className="text-slate-500 dark:text-slate-400">
      {user.lastActive ? timeAgo(new Date(user.lastActive)) : 'Never'}
    </span>
  );
}

export function SortableHead({
  label,
  field,
  activeField,
  onSort,
  align = 'left',
}: {
  label: string;
  field: UserSortField;
  activeField: UserSortField;
  onSort: (field: UserSortField) => void;
  align?: 'left' | 'right';
}) {
  return (
    <Button
      variant="ghost"
      className={`h-8 px-0 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-transparent hover:text-slate-950 dark:text-slate-400 dark:hover:text-white ${
        align === 'right' ? 'ml-auto' : ''
      }`}
      onClick={() => onSort(field)}
    >
      {label}
      {activeField === field && <ArrowUpDown className="ml-2 h-3.5 w-3.5" />}
    </Button>
  );
}

export function getSortValue(user: User, field: UserSortField) {
  switch (field) {
    case 'totalDurationSec':
      return user.currentMonthUsage.totalDurationSec;
    case 'totalCustomerCost':
      return user.currentMonthUsage.totalCustomerCost;
    case 'totalProfit':
      return user.currentMonthUsage.totalProfit;
    case 'lastActive':
      return user.lastActive ? new Date(user.lastActive).getTime() : 0;
    default:
      return user[field];
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? 'U';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

  return `${first}${last}`.toUpperCase();
}

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMinutes(seconds: number) {
  const minutes = Math.round(seconds / 60);

  if (minutes < 1 && seconds > 0) return '<1 min';

  return `${minutes.toLocaleString()} min`;
}
