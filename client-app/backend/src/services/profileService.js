const User = require('../models/User');
const { toUserDto } = require('../dtos/userDto');

/**
 * Get user profile.
 */
const getProfile = (user) => {
  return toUserDto(user);
};

/**
 * Update user profile (name only).
 */
const updateProfile = async (userId, { name }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return toUserDto(user);
};

module.exports = { getProfile, updateProfile };
