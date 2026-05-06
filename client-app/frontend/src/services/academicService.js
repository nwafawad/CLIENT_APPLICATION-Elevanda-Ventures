import api from './api';

export const getGrades = async (params = {}) => {
  const response = await api.get('/academics/grades', { params });
  return response.data;
};

export const getAttendance = async (params = {}) => {
  const response = await api.get('/academics/attendance', { params });
  return response.data;
};

export const getTimetable = async () => {
  const response = await api.get('/academics/timetable');
  return response.data;
};
