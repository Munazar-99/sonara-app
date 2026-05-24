import { UserRole, UserStatus } from '@prisma/client';

export type BillingRate = 0.5 | 1 | 2 | 5;

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  lastActive: string | null;
  apiKey?: string;
  billingRate: BillingRate;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  billingRate: BillingRate;
  status?: UserStatus;
  sendInvite?: boolean;
}
