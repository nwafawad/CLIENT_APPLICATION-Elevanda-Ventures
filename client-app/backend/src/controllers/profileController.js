const asyncHandler = require('../middlewares/asyncHandler');
const profileService = require('../services/profileService');

/**
 * GET /api/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = profileService.getProfile(req.user);

  res.status(200).json({
    success: true,
    data: { profile },
    message: '',
  });
});

/**
 * PATCH /api/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const profile = await profileService.updateProfile(req.user._id, { name });

  res.status(200).json({
    success: true,
    data: { profile },
    message: 'Profile updated successfully',
  });
});

module.exports = { getProfile, updateProfile };
