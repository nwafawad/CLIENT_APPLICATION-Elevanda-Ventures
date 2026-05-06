const asyncHandler = require('../middlewares/asyncHandler');
const academicService = require('../services/academicService');

/**
 * GET /api/academics/grades
 */
const getGrades = asyncHandler(async (req, res) => {
  const { term, subject } = req.query;
  const result = await academicService.getGrades(req.user, { term, subject });

  res.status(200).json({
    success: true,
    data: result,
    message: '',
  });
});

/**
 * GET /api/academics/attendance
 */
const getAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  const result = await academicService.getAttendance(req.user, { startDate, endDate, status });

  res.status(200).json({
    success: true,
    data: result,
    message: '',
  });
});

/**
 * GET /api/academics/timetable
 */
const getTimetable = asyncHandler(async (req, res) => {
  const result = await academicService.getTimetable(req.user);

  res.status(200).json({
    success: true,
    data: result,
    message: '',
  });
});

module.exports = { getGrades, getAttendance, getTimetable };
