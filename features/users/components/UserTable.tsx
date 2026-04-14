'use client';

import {
  MoreHorizontal,
  Search,
  ArrowUpDown,
  Eye,
  Pencil,
  RefreshCw,
  Ban,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '../types';
import { formatCurrency, getStatusBadgeStyles } from '../utils';
import { UserStatus } from '@prisma/client';

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onResendInvite?: (user: User) => void;
  onSuspendUser?: (user: User) => void;
  onReactivateUser?: (user: User) => void;
}

export function UserTable({
  users,
  onViewDetails,
  onEditUser,
  onResendInvite,
  onSuspendUser,
  onReactivateUser,
}: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Filter users based on search, status, and role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        (user.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    return (
      <Badge className={getStatusBadgeStyles(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get unique statuses and roles for filters
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(users.map(user => user.status)));
  }, [users]);

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(users.map(user => user.role)));
  }, [users]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 w-full border-muted bg-background pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full border-muted bg-background sm:w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full border-muted bg-background sm:w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="min-w-full bg-gray-50 dark:bg-gray-dark/50">
              <TableRow className="border-b border-gray-200 hover:bg-transparent dark:border-gray-700">
                <TableHead className="w-[16.6%] font-medium">
                  <Button
                    variant="ghost"
                    className="flex h-8 items-center p-0 font-medium"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortField === 'name' && (
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden w-[16.6%] font-medium md:table-cell">
                  <Button
                    variant="ghost"
                    className="flex h-8 items-center p-0 font-medium"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {sortField === 'email' && (
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[16.6%] font-medium">
                  <Button
                    variant="ghost"
                    className="flex h-8 items-center p-0 font-medium"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden w-[16.6%] font-medium md:table-cell">
                  Role
                </TableHead>
                <TableHead className="hidden w-[16.6%] font-medium lg:table-cell">
                  <Button
                    variant="ghost"
                    className="flex h-8 items-center p-0 font-medium"
                    onClick={() => handleSort('minutesUsed')}
                  >
                    Usage
                    {sortField === 'minutesUsed' && (
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[16.6%] font-medium">
                  <Button
                    variant="ghost"
                    className="flex h-8 items-center p-0 font-medium"
                    onClick={() => handleSort('currentSpend')}
                  >
                    Spend
                    {sortField === 'currentSpend' && (
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="w-[80px] text-right font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map(user => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => onViewDetails(user)}
                >
                  <TableCell className="w-[16.6%] font-medium">
                    <div>
                      {user.name}
                      <div className="mt-1 text-xs text-muted-foreground md:hidden">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden w-[16.6%] md:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="w-[16.6%]">
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="hidden w-[16.6%] md:table-cell">
                    <Badge variant="outline" className="font-normal">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden w-[16.6%] lg:table-cell">
                    <div className="flex flex-col">
                      <span>{user.minutesUsed} min</span>
                      <span className="text-xs text-muted-foreground">
                        {user.callsMade} calls
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[16.6%]">
                    <div className="font-medium">
                      {formatCurrency(user.currentSpend)}
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={e => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            onViewDetails(user);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            onEditUser(user);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        {user.status === 'pending' && onResendInvite && (
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              onResendInvite(user);
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            <span>Resend Invite</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.status === 'active' && onSuspendUser ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={e => {
                              e.stopPropagation();
                              onSuspendUser(user);
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Suspend User</span>
                          </DropdownMenuItem>
                        ) : user.status === 'suspended' && onReactivateUser ? (
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              onReactivateUser(user);
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Reactivate User</span>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {sortedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No users found</p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {sortedUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
}
