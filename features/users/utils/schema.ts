import { UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'standard']);

export const userStatusSchema = z.enum(['active', 'pending', 'suspended']);

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  status: userStatusSchema,
  role: userRoleSchema,
  minutesUsed: z.number().nonnegative(),
  callsMade: z.number().nonnegative(),
  dateAdded: z.string(),
  lastActive: z.string(),
  billingRate: z.number().nonnegative(),
  currentSpend: z.number().nonnegative(),
});

export const addUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  role: userRoleSchema,
  billingRate: z.number().nonnegative(),
  sendInvite: z.boolean().default(true),
  apiKey: z.string().min(1, 'API Key is required'),
});

export const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  role: userRoleSchema,
  apiKey: z.string().min(1, 'API Key is required'),
  status: userStatusSchema,
  billingRate: z.number().nonnegative(),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().trim().toLowerCase().email('Invalid email').optional(),
  role: z.nativeEnum(UserRole).optional(),
  billingRate: z.coerce
    .number()
    .min(0, 'Billing rate must be positive')
    .optional(),
  status: z.nativeEnum(UserStatus).optional(),
  apiKey: z.string(),
});
