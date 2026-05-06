/**
 * Transforms a User document into a safe DTO.
 * Omits passwordHash, deviceId, and __v.
 */
const toUserDto = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isDeviceVerified: user.isDeviceVerified,
    childId: user.childId || null,
    createdAt: user.createdAt,
  };
};

module.exports = { toUserDto };
