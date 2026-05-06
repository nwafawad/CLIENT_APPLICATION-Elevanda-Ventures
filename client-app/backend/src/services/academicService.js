const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const { toGradeDto, toAttendanceDto, toTimetableDto } = require('../dtos/academicDto');

/**
 * Resolve the target student ID based on user role.
 * Students see their own data; parents see their child's data.
 */
const resolveStudentId = (user) => {
  if (user.role === 'student') return user._id;
  if (user.role === 'parent') return user.childId;
  return null;
};

/**
 * Get grades for the student (or parent's child).
 */
const getGrades = async (user, { term, subject }) => {
  const studentId = resolveStudentId(user);

  if (!studentId) {
    const error = new Error('No student associated with this account');
    error.statusCode = 400;
    throw error;
  }

  const query = { studentId };
  if (term) query.term = term;
  if (subject) query.subject = { $regex: subject, $options: 'i' };

  const grades = await Grade.find(query).sort({ createdAt: -1 });

  // Get student name for parent view
  let studentName = null;
  if (user.role === 'parent') {
    const student = await User.findById(studentId).select('name');
    studentName = student?.name || null;
  }

  return {
    grades: grades.map(toGradeDto),
    studentName,
  };
};

/**
 * Get attendance for the student (or parent's child).
 */
const getAttendance = async (user, { startDate, endDate, status }) => {
  const studentId = resolveStudentId(user);

  if (!studentId) {
    const error = new Error('No student associated with this account');
    error.statusCode = 400;
    throw error;
  }

  const query = { studentId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (status) query.status = status;

  const records = await Attendance.find(query).sort({ date: -1 });

  // Compute summary
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'late').length;
  const attendanceRate = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

  // Get student name for parent view
  let studentName = null;
  if (user.role === 'parent') {
    const student = await User.findById(studentId).select('name');
    studentName = student?.name || null;
  }

  return {
    records: records.map(toAttendanceDto),
    summary: { total, present, absent, late, attendanceRate: parseFloat(attendanceRate) },
    studentName,
  };
};

/**
 * Get timetable grouped by day of week.
 */
const getTimetable = async (user) => {
  const studentId = resolveStudentId(user);

  if (!studentId) {
    const error = new Error('No student associated with this account');
    error.statusCode = 400;
    throw error;
  }

  // Get the student's classId
  const student = await User.findById(studentId).select('classId name');

  if (!student?.classId) {
    return { timetable: {}, studentName: student?.name || null };
  }

  const entries = await Timetable.find({ classId: student.classId })
    .populate('teacherId', 'name')
    .sort({ startTime: 1 });

  // Group by day of week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const grouped = {};

  days.forEach((day) => {
    grouped[day] = entries
      .filter((e) => e.dayOfWeek === day)
      .map((e) => ({
        ...toTimetableDto(e),
        teacherName: e.teacherId?.name || 'TBD',
      }));
  });

  let studentName = null;
  if (user.role === 'parent') {
    studentName = student?.name || null;
  }

  return { timetable: grouped, studentName };
};

module.exports = { getGrades, getAttendance, getTimetable };
