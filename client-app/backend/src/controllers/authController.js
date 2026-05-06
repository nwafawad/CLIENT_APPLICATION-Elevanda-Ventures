const asyncHandler = require('../middlewares/asyncHandler');
const authService = require('../services/authService');
const { JWT_EXPIRES_IN } = require('../config/env');

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, deviceId, childId } = req.body;

  const result = await authService.register({
    name,
    email,
    password,
    role,
    deviceId,
    childId,
  });

  res.status(201).json({
    success: true,
    data: {},
    message: result.message,
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, deviceId } = req.body;

  const { token, user } = await authService.login({ email, password, deviceId });

  // Parse JWT_EXPIRES_IN (e.g., "30m") to milliseconds for cookie maxAge
  const expiresInMs = parseExpiry(JWT_EXPIRES_IN);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresInMs,
  });

  res.status(200).json({
    success: true,
    data: { user },
    message: 'Login successful',
  });
});

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  const user = authService.getMe(req.user);

  res.status(200).json({
    success: true,
    data: { user },
    message: '',
  });
});

/**
 * Parse JWT expiry string (e.g., "30m", "1h", "7d") to milliseconds.
 */
function parseExpiry(expiresIn) {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 30 * 60 * 1000; // default 30 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 30 * 60 * 1000;
  }
}

module.exports = { register, login, logout, getMe };
