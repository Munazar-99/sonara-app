import { UserRole, UserStatus } from '@prisma/client';

export type BillingRate = number;

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
  currentMonthUsage: {
    totalCalls: number;
    totalDurationSec: number;
    totalProviderCost: number;
    totalCustomerCost: number;
    totalProfit: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  billingRate: BillingRate;
  status?: UserStatus;
  sendInvite?: boolean;
}
