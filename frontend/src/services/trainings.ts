import { api } from './api';
import { TrainingProgram, Course, Module } from '@/types';

export const trainingsApi = {
  list: (params?: { status?: string; department_id?: string }) =>
    api.get<TrainingProgram[]>('/trainings', { params }),

  get: (id: string) => api.get<TrainingProgram>(`/trainings/${id}`),

  create: (data: Partial<TrainingProgram>) => api.post<TrainingProgram>('/trainings', data),

  update: (id: string, data: Partial<TrainingProgram>) => api.put<TrainingProgram>(`/trainings/${id}`, data),

  delete: (id: string) => api.delete(`/trainings/${id}`),

  // Courses
  listCourses: (programId: string) => api.get<Course[]>(`/trainings/${programId}/courses`),

  createCourse: (programId: string, data: Partial<Course>) =>
    api.post<Course>(`/trainings/${programId}/courses`, data),

  updateCourse: (courseId: string, data: Partial<Course>) => api.put<Course>(`/trainings/courses/${courseId}`, data),

  // Modules
  listModules: (courseId: string) => api.get<Module[]>(`/trainings/courses/${courseId}/modules`),

  createModule: (courseId: string, data: Partial<Module>) =>
    api.post<Module>(`/trainings/courses/${courseId}/modules`, data),

  updateModule: (moduleId: string, data: Partial<Module>) => api.put<Module>(`/trainings/modules/${moduleId}`, data),
};