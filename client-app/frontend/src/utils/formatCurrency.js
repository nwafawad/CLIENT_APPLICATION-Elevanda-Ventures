/**
 * Format a number as Rwandan Franc (RWF) currency.
 */
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'RWF 0';
  return `RWF ${Number(amount).toLocaleString('en-RW')}`;
};
