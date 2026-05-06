const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All profile routes require authentication
router.use(authMiddleware);

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

// GET /api/profile
router.get('/', getProfile);

// PATCH /api/profile
router.patch(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters')
      .escape(),
  ],
  validate,
  updateProfile
);

module.exports = router;
