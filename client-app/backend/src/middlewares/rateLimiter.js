const rateLimit = require('express-rate-limit');

/**
 * General rate limiter: 100 requests per 15-minute window.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errors: [],
  },
});

const { AUTH_LIMIT_MAX } = require('../config/env');

/**
 * Auth rate limiter: configurable attempts per 15-minute window.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: AUTH_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    errors: [],
  },
});

module.exports = { generalLimiter, authLimiter };
