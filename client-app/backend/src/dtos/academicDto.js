/**
 * Transforms a Grade document into a DTO.
 */
const toGradeDto = (grade) => {
  if (!grade) return null;
  return {
    id: grade._id,
    subject: grade.subject,
    score: grade.score,
    grade: grade.grade,
    term: grade.term,
    createdAt: grade.createdAt,
  };
};

/**
 * Transforms an Attendance document into a DTO.
 */
const toAttendanceDto = (attendance) => {
  if (!attendance) return null;
  return {
    id: attendance._id,
    date: attendance.date,
    status: attendance.status,
    classId: attendance.classId,
    createdAt: attendance.createdAt,
  };
};

/**
 * Transforms a Timetable document into a DTO.
 */
const toTimetableDto = (entry) => {
  if (!entry) return null;
  return {
    id: entry._id,
    subject: entry.subject,
    teacherId: entry.teacherId,
    dayOfWeek: entry.dayOfWeek,
    startTime: entry.startTime,
    endTime: entry.endTime,
  };
};

module.exports = { toGradeDto, toAttendanceDto, toTimetableDto };
