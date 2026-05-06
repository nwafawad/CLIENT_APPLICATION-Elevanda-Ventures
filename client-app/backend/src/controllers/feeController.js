const asyncHandler = require('../middlewares/asyncHandler');
const feeService = require('../services/feeService');

/**
 * POST /api/fees/deposit
 */
const deposit = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const transaction = await feeService.deposit(req.user._id, { amount, description });

  res.status(201).json({
    success: true,
    data: { transaction },
    message: 'Deposit submitted successfully',
  });
});

/**
 * POST /api/fees/withdraw
 */
const withdraw = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const transaction = await feeService.withdraw(req.user._id, { amount, description });

  res.status(201).json({
    success: true,
    data: { transaction },
    message: 'Withdrawal submitted successfully',
  });
});

/**
 * GET /api/fees/balance
 */
const getBalance = asyncHandler(async (req, res) => {
  const balance = await feeService.getBalance(req.user._id);

  res.status(200).json({
    success: true,
    data: { balance },
    message: '',
  });
});

/**
 * GET /api/fees/history
 */
const getHistory = asyncHandler(async (req, res) => {
  const { page, limit, type, status } = req.query;
  const result = await feeService.getHistory(req.user._id, { page, limit, type, status });

  res.status(200).json({
    success: true,
    data: result,
    message: '',
  });
});

module.exports = { deposit, withdraw, getBalance, getHistory };
