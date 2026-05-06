const express = require('express');
const { body, query } = require('express-validator');
const { validationResult } = require('express-validator');
const { deposit, withdraw, getBalance, getHistory } = require('../controllers/feeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All fee routes require authentication and student/parent role
router.use(authMiddleware);
router.use(roleMiddleware('student', 'parent'));

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// POST /api/fees/deposit
router.post(
  '/deposit',
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
      .escape(),
  ],
  validate,
  deposit
);

// POST /api/fees/withdraw
router.post(
  '/withdraw',
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters')
      .escape(),
  ],
  validate,
  withdraw
);

// GET /api/fees/balance
router.get('/balance', getBalance);

// GET /api/fees/history
router.get(
  '/history',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('type').optional().isIn(['deposit', 'withdraw']).withMessage('Type must be deposit or withdraw'),
    query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  ],
  validate,
  getHistory
);

module.exports = router;
