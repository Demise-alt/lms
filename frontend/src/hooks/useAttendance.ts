import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/services/attendance';
import { Attendance } from '@/types';

export const useSessionAttendance = (sessionId: string) => {
  return useQuery({
    queryKey: ['attendance', 'session', sessionId],
    queryFn: () => attendanceApi.listBySession(sessionId),
    select: (response) => response.data,
    enabled: !!sessionId,
  });
};

export const useEmployeeAttendance = (employeeId: string) => {
  return useQuery({
    queryKey: ['attendance', 'employee', employeeId],
    queryFn: () => attendanceApi.listByEmployee(employeeId),
    select: (response) => response.data,
    enabled: !!employeeId,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Attendance>) => attendanceApi.mark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useBulkMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { session_id: string; records: Partial<Attendance>[] }) =>
      attendanceApi.bulkMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useAttendanceRate = (employeeId: string, trainingProgramId?: string) => {
  return useQuery({
    queryKey: ['attendance', 'rate', employeeId, trainingProgramId],
    queryFn: () => attendanceApi.getAttendanceRate(employeeId, trainingProgramId),
    enabled: !!employeeId,
  });
};