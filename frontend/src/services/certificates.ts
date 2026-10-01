import { api } from './api';
import { Certificate } from '@/types';

export const certificatesApi = {
  list: (params?: { employee_id?: string; training_program_id?: string }) =>
    api.get<Certificate[]>('/certificates', { params }),

  get: (id: string) => api.get<Certificate>(`/certificates/${id}`),

  issue: (data: {
    employee_id: string;
    training_program_id: string;
    expiry_date?: string;
    issuer_name?: string
  }) => api.post<Certificate>('/certificates', null, { params: data }),

  revoke: (id: string) => api.delete(`/certificates/${id}`),

  verify: (certificateNumber: string) =>
    api.get<{ valid: boolean; reason?: string; certificate_number: string }>(
      `/certificates/verify/${certificateNumber}`
    ),
};