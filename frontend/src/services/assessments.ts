import { api } from './api';
import { Assessment, Question, AssessmentAttempt } from '@/types';

export const assessmentsApi = {
  list: (params?: {
    training_program_id?: string;
    module_id?: string;
    assessment_type?: string;
  }) => api.get<Assessment[]>('/assessments', { params }),

  get: (id: string) => api.get<Assessment>(`/assessments/${id}`),

  create: (data: Partial<Assessment> & { questions?: Partial<Question>[] }) =>
    api.post<Assessment>('/assessments', data),

  update: (id: string, data: Partial<Assessment>) =>
    api.put<Assessment>(`/assessments/${id}`, data),

  // Attempts
  startAttempt: (assessmentId: string, employeeId: string) =>
    api.post<AssessmentAttempt>(`/assessments/${assessmentId}/start`, undefined, {
      params: { employee_id: employeeId }
    }),

  submitAttempt: (attemptId: string, answers: { question_id: string; selected_answer: string }[]) =>
    api.post<AssessmentAttempt>(`/assessments/attempts/${attemptId}/submit`, { answers }),
};