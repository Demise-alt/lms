import { api } from './api';
import { Assignment, AssignmentSubmission } from '@/types';

export const assignmentsApi = {
  list: (params?: {
    training_program_id?: string;
    course_id?: string;
    status?: string;
  }) => api.get<Assignment[]>('/assignments', { params }),

  get: (id: string) => api.get<Assignment>(`/assignments/${id}`),

  create: (data: Partial<Assignment>) => api.post<Assignment>('/assignments', data),

  update: (id: string, data: Partial<Assignment>) => api.put<Assignment>(`/assignments/${id}`, data),

  delete: (id: string) => api.delete(`/assignments/${id}`),

  // Submissions
  listSubmissions: (assignmentId: string, params?: {
    employee_id?: string;
    status?: string;
  }) => api.get<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`, { params }),

  createSubmission: (data: Partial<AssignmentSubmission>) =>
    api.post<AssignmentSubmission>('/assignments/submissions', data),

  updateSubmission: (submissionId: string, data: Partial<AssignmentSubmission>) =>
    api.put<AssignmentSubmission>(`/assignments/submissions/${submissionId}`, data),

  // Employee assignments
  getEmployeeAssignments: (employeeId: string, params?: { status?: string }) =>
    api.get<Assignment[]>(`/assignments/employee/${employeeId}`, { params }),
};