export function getUsagePeriod(date: Date) {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function calculateCustomerCallCost(durationSeconds: number) {
  const durationMinutes = durationSeconds / 60;

  if (durationMinutes <= 3) {
    return 1;
  }

  const extraMinutes = Math.ceil(durationMinutes - 3);

  return 1 + extraMinutes * 0.5;
}
// helpers/money.ts

export function roundMoney(value: number) {
  return Number(value.toFixed(3));
}

// utils/logger.ts

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(message, meta);
  },

  error: (message: string, meta?: unknown) => {
    console.error(message, meta);
  },
};

// utils/safeJsonParse.ts

export function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
