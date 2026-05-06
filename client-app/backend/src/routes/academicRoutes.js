const express = require('express');
const { query } = require('express-validator');
const { validationResult } = require('express-validator');
const { getGrades, getAttendance, getTimetable } = require('../controllers/academicController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All academic routes require authentication and student/parent role
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

// GET /api/academics/grades
router.get(
  '/grades',
  [
    query('term').optional().trim().escape(),
    query('subject').optional().trim().escape(),
  ],
  validate,
  getGrades
);

// GET /api/academics/attendance
router.get(
  '/attendance',
  [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    query('status').optional().isIn(['present', 'absent', 'late']).withMessage('Invalid status'),
  ],
  validate,
  getAttendance
);

// GET /api/academics/timetable
router.get('/timetable', getTimetable);

module.exports = router;
