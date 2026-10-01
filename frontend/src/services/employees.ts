import { api } from './api';
import { Employee, EmployeeListResponse, Department } from '@/types';

export const employeesApi = {
  list: (params?: {
    page?: number;
    size?: number;
    department_id?: string;
    search?: string;
  }) => api.get<EmployeeListResponse>('/employees', { params }),

  get: (id: string) => api.get<Employee>(`/employees/${id}`),

  create: (data: Partial<Employee>) => api.post<Employee>('/employees', data),

  update: (id: string, data: Partial<Employee>) => api.put<Employee>(`/employees/${id}`, data),

  delete: (id: string) => api.delete(`/employees/${id}`),
};

export const departmentsApi = {
  list: () => api.get<Department[]>('/departments'),

  get: (id: string) => api.get<Department>(`/departments/${id}`),

  create: (data: Partial<Department>) => api.post<Department>('/departments', data),

  update: (id: string, data: Partial<Department>) => api.put<Department>(`/departments/${id}`, data),

  delete: (id: string) => api.delete(`/departments/${id}`),
};