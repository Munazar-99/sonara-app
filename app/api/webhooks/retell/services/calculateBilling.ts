// services/calculateBilling.ts

import { calculateCustomerCallCost, roundMoney } from '../helpers';

export function calculateBilling(
  durationSeconds: number,
  providerCost: number,
) {
  const customerCost = roundMoney(calculateCustomerCallCost(durationSeconds));

  const profit = roundMoney(customerCost - providerCost);

  return {
    customerCost,
    providerCost,
    profit,
  };
}
