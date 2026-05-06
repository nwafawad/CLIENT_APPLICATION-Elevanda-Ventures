const FeeTransaction = require('../models/FeeTransaction');
const FeeBalance = require('../models/FeeBalance');
const { LOW_BALANCE_THRESHOLD } = require('../config/env');
const { toFeeDto, toBalanceDto } = require('../dtos/feeDto');

/**
 * Create a deposit transaction.
 */
const deposit = async (userId, { amount, description }) => {
  const transaction = await FeeTransaction.create({
    userId,
    type: 'deposit',
    amount,
    description: description || '',
    status: 'pending',
  });

  return toFeeDto(transaction);
};

/**
 * Create a withdrawal transaction.
 */
const withdraw = async (userId, { amount, description }) => {
  // Check balance
  const feeBalance = await FeeBalance.findOne({ userId });

  if (!feeBalance || feeBalance.balance < amount) {
    const error = new Error('Insufficient balance');
    error.statusCode = 400;
    throw error;
  }

  const transaction = await FeeTransaction.create({
    userId,
    type: 'withdraw',
    amount,
    description: description || '',
    status: 'pending',
  });

  return toFeeDto(transaction);
};

/**
 * Get balance for a user.
 */
const getBalance = async (userId) => {
  let feeBalance = await FeeBalance.findOne({ userId });

  if (!feeBalance) {
    feeBalance = await FeeBalance.create({ userId, balance: 0 });
  }

  return toBalanceDto(feeBalance, LOW_BALANCE_THRESHOLD);
};

/**
 * Get paginated transaction history.
 */
const getHistory = async (userId, { page = 1, limit = 10, type, status }) => {
  const query = { userId };

  if (type) query.type = type;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    FeeTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    FeeTransaction.countDocuments(query),
  ]);

  return {
    transactions: transactions.map(toFeeDto),
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { deposit, withdraw, getBalance, getHistory };
