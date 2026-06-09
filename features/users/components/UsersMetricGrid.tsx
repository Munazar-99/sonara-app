'use client';

import { Activity, Clock3, CreditCard, TrendingUp, Users } from 'lucide-react';
import { User } from '../types';
import { formatCurrency } from '../utils';

export function UsersMetricGrid({ users }: { users: User[] }) {
  const activeUsers = users.filter(user => user.status === 'active').length;
  const pendingUsers = users.filter(user => user.status === 'pending').length;
  const totalDurationSec = users.reduce(
    (sum, user) => sum + user.currentMonthUsage.totalDurationSec,
    0,
  );
  const totalCustomerSpend = users.reduce(
    (sum, user) => sum + user.currentMonthUsage.totalCustomerCost,
    0,
  );
  const totalProfit = users.reduce(
    (sum, user) => sum + user.currentMonthUsage.totalProfit,
    0,
  );
  const totalCalls = users.reduce(
    (sum, user) => sum + user.currentMonthUsage.totalCalls,
    0,
  );

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total users"
        value={users.length.toString()}
        detail={`${activeUsers} active · ${pendingUsers} pending`}
        icon={Users}
      />
      <MetricCard
        label="Current month usage"
        value={`${Math.round(totalDurationSec / 60).toLocaleString()} min`}
        detail={`${totalCalls.toLocaleString()} calls`}
        icon={Clock3}
      />
      <MetricCard
        label="Customer spend"
        value={formatCurrency(totalCustomerSpend)}
        detail="Billed this month"
        icon={CreditCard}
      />
      <MetricCard
        label="Profit"
        value={formatCurrency(totalProfit)}
        detail="Current month margin"
        icon={TrendingUp}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18202f]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {detail}
          </p>
        </div>
        <div className="rounded-lg border border-primary/15 bg-primary/10 p-2 text-primary dark:border-primary/20 dark:bg-primary/15">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
