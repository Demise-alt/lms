import { api } from './api';
import { TrainingSession } from '@/types';

export const sessionsApi = {
  list: (params?: {
    training_program_id?: string;
    trainer_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => api.get<TrainingSession[]>('/sessions', { params }),

  getCalendar: (month: number, year: number) =>
    api.get<{ sessions: TrainingSession[]; month: number; year: number }>('/sessions/calendar', {
      params: { month, year },
    }),

  get: (id: string) => api.get<TrainingSession>(`/sessions/${id}`),

  create: (data: Partial<TrainingSession>) => api.post<TrainingSession>('/sessions', data),

  update: (id: string, data: Partial<TrainingSession>) => api.put<TrainingSession>(`/sessions/${id}`, data),

  delete: (id: string) => api.delete(`/sessions/${id}`),
};