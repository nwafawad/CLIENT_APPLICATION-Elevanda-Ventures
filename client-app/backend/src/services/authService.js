const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FeeBalance = require('../models/FeeBalance');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { toUserDto } = require('../dtos/userDto');

/**
 * Hash a password with a random salt using SHA-512.
 * The client already sends a SHA-512 hash, so this is a double-hash for extra security.
 */
const hashPassword = (preHashedPassword) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha512').update(preHashedPassword + salt).digest('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify a password against a stored salt:hash pair.
 */
const verifyPassword = (preHashedPassword, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  const computedHash = crypto.createHash('sha512').update(preHashedPassword + salt).digest('hex');
  return computedHash === hash;
};

/**
 * Generate a JWT token.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Register a new user.
 */
const register = async ({ name, email, password, role, deviceId, childId }) => {
  // Check if email already registered
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  // If parent, resolve childId from email if it's an email string
  let resolvedChildId = null;
  if (role === 'parent' && childId) {
    // childId might be an email or an ObjectId
    const isEmail = childId.includes('@');
    if (isEmail) {
      const childUser = await User.findOne({ email: childId.toLowerCase() });
      if (!childUser) {
        const error = new Error('Child email not found. The student must register first.');
        error.statusCode = 404;
        throw error;
      }
      if (childUser.role !== 'student') {
        const error = new Error('The specified child must have a student role');
        error.statusCode = 400;
        throw error;
      }
      resolvedChildId = childUser._id;
    } else {
      resolvedChildId = childId;
    }
  }

  // Hash password (client already SHA-512'd it, we double-hash with salt)
  const passwordHash = hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    deviceId,
    isDeviceVerified: false,
    childId: resolvedChildId,
  });

  // Create initial fee balance
  await FeeBalance.create({ userId: user._id, balance: 0 });

  return { message: 'Registration successful. Await admin device verification.' };
};

/**
 * Login a user.
 */
const login = async ({ email, password, deviceId }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check device verification
  if (!user.isDeviceVerified) {
    const error = new Error('Your device is pending admin verification.');
    error.statusCode = 403;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);
  const userDto = toUserDto(user);

  return { token, user: userDto };
};

/**
 * Get current authenticated user.
 */
const getMe = (user) => {
  return toUserDto(user);
};

module.exports = { register, login, getMe };
