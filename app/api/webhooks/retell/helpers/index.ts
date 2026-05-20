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
export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
