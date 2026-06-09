'use client';

import { Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '../types';
import {
  getSortValue,
  LastActiveCell,
  MoneyCell,
  RoleBadge,
  SortableHead,
  StatusBadge,
  UsageCell,
  UserCell,
  userColumnWidths,
  userTableMinWidth,
} from './UserTableColumns';
import {
  SortDirection,
  UserSortField,
  UserTableActionHandlers,
} from './user-table-types';
import { UserTableActions } from './UserTableActions';

type UserTableProps = UserTableActionHandlers & {
  users: User[];
};

export function UserTable({
  users,
  onViewDetails,
  onEditUser,
  onResendInvite,
  onSuspendUser,
  onReactivateUser,
}: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<UserSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter(user => {
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(users.map(user => user.status))),
    [users],
  );

  const uniqueRoles = useMemo(
    () => Array.from(new Set(users.map(user => user.role))),
    [users],
  );

  const handleSort = (field: UserSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortField(field);
    setSortDirection('asc');
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#18202f]">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-[#18202f] lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-dark dark:text-white" />
          <Input
            placeholder="Search users by name or email"
            className="h-10 rounded-lg border-slate-200 bg-slate-50 pl-9 text-slate-950 shadow-none focus-visible:ring-primary/30 dark:border-white/10 dark:bg-[#111827] dark:text-white dark:placeholder:text-slate-500"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-slate-50 text-slate-700 shadow-none focus:ring-primary/30 dark:border-white/10 dark:bg-[#111827] dark:text-slate-200 sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {formatLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-slate-50 text-slate-700 shadow-none focus:ring-primary/30 dark:border-white/10 dark:bg-[#111827] dark:text-slate-200 sm:w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>
                  {formatLabel(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          className="table-fixed"
          style={{
            minWidth: userTableMinWidth,
          }}
        >
          <colgroup>
            {userColumnWidths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow className="border-slate-200/80 bg-slate-50 hover:bg-slate-50 dark:border-white/10 dark:bg-[#111827] dark:hover:bg-[#111827]">
              <TableHead className="px-4">
                <SortableHead
                  label="User"
                  field="name"
                  activeField={sortField}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4">
                <SortableHead
                  label="Status"
                  field="status"
                  activeField={sortField}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4">
                <SortableHead
                  label="Role"
                  field="role"
                  activeField={sortField}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4 text-right">
                <SortableHead
                  label="Usage"
                  field="totalDurationSec"
                  activeField={sortField}
                  onSort={handleSort}
                  align="right"
                />
              </TableHead>
              <TableHead className="px-4 text-right">
                <SortableHead
                  label="Spend"
                  field="totalCustomerCost"
                  activeField={sortField}
                  onSort={handleSort}
                  align="right"
                />
              </TableHead>
              <TableHead className="px-4 text-right">
                <SortableHead
                  label="Profit"
                  field="totalProfit"
                  activeField={sortField}
                  onSort={handleSort}
                  align="right"
                />
              </TableHead>
              <TableHead className="px-4">
                <SortableHead
                  label="Last active"
                  field="lastActive"
                  activeField={sortField}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map(user => (
              <TableRow
                key={user.id}
                className="cursor-pointer border-slate-100 hover:bg-slate-50/80 dark:border-white/10 dark:hover:bg-[#20293a]"
                onClick={() => onViewDetails(user)}
              >
                <TableCell className="px-4 py-3">
                  <UserCell user={user} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <RoleBadge user={user} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <UsageCell user={user} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <MoneyCell value={user.currentMonthUsage.totalCustomerCost} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <MoneyCell value={user.currentMonthUsage.totalProfit} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <LastActiveCell user={user} />
                </TableCell>
                <TableCell
                  className="px-4 py-3 text-right"
                  onClick={event => event.stopPropagation()}
                >
                  <UserTableActions
                    user={user}
                    onViewDetails={onViewDetails}
                    onEditUser={onEditUser}
                    onResendInvite={onResendInvite}
                    onSuspendUser={onSuspendUser}
                    onReactivateUser={onReactivateUser}
                  />
                </TableCell>
              </TableRow>
            ))}

            {sortedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                    <div className="mb-3 rounded-lg bg-primary/10 p-3 text-primary dark:bg-primary/15">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-slate-950 dark:text-white">
                      No users found
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {sortedUsers.length.toLocaleString()} of{' '}
          {users.length.toLocaleString()} users
        </p>
        <p>Current month usage and spend</p>
      </div>
    </section>
  );
}

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
