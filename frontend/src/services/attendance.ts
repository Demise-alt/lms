import { api } from './api';
import { Attendance } from '@/types';

export const attendanceApi = {
  listBySession: (sessionId: string) => api.get<Attendance[]>(`/attendance/session/${sessionId}`),

  listByEmployee: (employeeId: string) => api.get<Attendance[]>(`/attendance/employee/${employeeId}`),

  mark: (data: Partial<Attendance>) => api.post<Attendance>('/attendance', data),

  bulkMark: (data: { session_id: string; records: Partial<Attendance>[] }) =>
    api.post<Attendance[]>(`/attendance/bulk`, data),

  getAttendanceRate: (employeeId: string, trainingProgramId?: string) =>
    api.get<{ employee_id: string; total_sessions: number; attended_sessions: number; attendance_rate: number }>(
      `/attendance/employee/${employeeId}/rate`,
      { params: { training_program_id: trainingProgramId } }
    ),
};