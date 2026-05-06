import { useQuery } from '@tanstack/react-query';
import { getGrades, getAttendance, getTimetable } from '../services/academicService';

export const useGrades = (params = {}) => {
  return useQuery({
    queryKey: ['grades', params],
    queryFn: () => getGrades(params),
    select: (data) => data.data,
  });
};

export const useAttendance = (params = {}) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => getAttendance(params),
    select: (data) => data.data,
  });
};

export const useTimetable = () => {
  return useQuery({
    queryKey: ['timetable'],
    queryFn: getTimetable,
    select: (data) => data.data,
  });
};
