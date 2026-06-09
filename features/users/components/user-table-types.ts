import { User } from '../types';

export type UserSortField =
  | 'name'
  | 'email'
  | 'status'
  | 'role'
  | 'totalDurationSec'
  | 'totalCustomerCost'
  | 'totalProfit'
  | 'lastActive';

export type SortDirection = 'asc' | 'desc';

export type UserTableActionHandlers = {
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onResendInvite?: (user: User) => void;
  onSuspendUser?: (user: User) => void;
  onReactivateUser?: (user: User) => void;
};
