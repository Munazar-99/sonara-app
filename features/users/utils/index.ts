import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserStatus } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (dateString === '-') return 'Never';

  return new Date(dateString).toDateString();
}

export function getStatusBadgeStyles(status: UserStatus) {
  switch (status) {
    case 'active':
      return 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300';
    case 'pending':
      return 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300';
    case 'suspended':
      return 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300';
    default:
      return '';
  }
}

export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}
