/**
 * Transforms a FeeTransaction document into a DTO.
 */
const toFeeDto = (transaction) => {
  if (!transaction) return null;
  return {
    id: transaction._id,
    type: transaction.type,
    amount: transaction.amount,
    status: transaction.status,
    description: transaction.description,
    createdAt: transaction.createdAt,
  };
};

/**
 * Transforms a FeeBalance document into a DTO.
 */
const toBalanceDto = (balance, threshold) => {
  if (!balance) return null;
  return {
    balance: balance.balance,
    isLow: balance.balance < threshold,
    updatedAt: balance.updatedAt,
  };
};

module.exports = { toFeeDto, toBalanceDto };
