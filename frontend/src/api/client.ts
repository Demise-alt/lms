import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('eltms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  // Auth
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post('/auth/login', data),
    me: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // Employees
  employees: {
    list: (params?: any) => apiClient.get('/employees', { params }),
    get: (id: string) => apiClient.get(`/employees/${id}`),
    create: (data: any) => apiClient.post('/employees', data),
    update: (id: string, data: any) => apiClient.put(`/employees/${id}`, data),
    delete: (id: string) => apiClient.delete(`/employees/${id}`),
  },

  // Trainings
  trainings: {
    list: (params?: any) => apiClient.get('/trainings', { params }),
    get: (id: string) => apiClient.get(`/trainings/${id}`),
    create: (data: any) => apiClient.post('/trainings', data),
    update: (id: string, data: any) => apiClient.put(`/trainings/${id}`, data),
  },

  // Sessions
  sessions: {
    list: (params?: any) => apiClient.get('/sessions', { params }),
    get: (id: string) => apiClient.get(`/sessions/${id}`),
    create: (data: any) => apiClient.post('/sessions', data),
  },

  // Attendance
  attendance: {
    list: (params?: any) => apiClient.get('/attendance', { params }),
    mark: (data: any) => apiClient.post('/attendance', data),
    update: (id: string, data: any) => apiClient.put(`/attendance/${id}`, data),
  },

  // Assessments
  assessments: {
    list: (params?: any) => apiClient.get('/assessments', { params }),
    get: (id: string) => apiClient.get(`/assessments/${id}`),
    create: (data: any) => apiClient.post('/assessments', data),
    submit: (id: string, data: any) => apiClient.post(`/assessments/${id}/submit`, data),
  },

  // Analytics
  analytics: {
    dashboard: () => apiClient.get('/analytics/dashboard'),
    employees: (params?: any) => apiClient.get('/analytics/employees', { params }),
    skillGaps: () => apiClient.get('/analytics/skill-gaps'),
  },

  // Certificates
  certificates: {
    list: (params?: any) => apiClient.get('/certificates', { params }),
    get: (id: string) => apiClient.get(`/certificates/${id}`),
    issue: (data: any) => apiClient.post('/certificates', data),
  },

  // Notifications
  notifications: {
    list: () => apiClient.get('/notifications'),
    markRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  }
}

export default api
