import { api } from './api';

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),

  enrollmentTrends: (months?: number) =>
    api.get('/analytics/enrollment-trends', { params: { months } }),

  completionRates: () => api.get('/analytics/completion-rates'),

  departmentAnalytics: () => api.get('/analytics/department-analytics'),

  skillGaps: () => api.get('/analytics/skill-gaps'),

  effectiveness: () => api.get('/analytics/effectiveness'),

  employees: (params?: { employee_id?: string; training_program_id?: string }) =>
    api.get('/analytics/employees', { params }),
};