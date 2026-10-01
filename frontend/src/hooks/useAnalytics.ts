import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/analytics';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.dashboard(),
    select: (response) => response.data,
  });
};

export const useEnrollmentTrends = (months?: number) => {
  return useQuery({
    queryKey: ['analytics', 'enrollment-trends', months],
    queryFn: () => analyticsApi.enrollmentTrends(months),
    select: (response) => response.data,
  });
};

export const useCompletionRates = () => {
  return useQuery({
    queryKey: ['analytics', 'completion-rates'],
    queryFn: () => analyticsApi.completionRates(),
    select: (response) => response.data,
  });
};

export const useDepartmentAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'department-analytics'],
    queryFn: () => analyticsApi.departmentAnalytics(),
    select: (response) => response.data,
  });
};

export const useSkillGaps = () => {
  return useQuery({
    queryKey: ['analytics', 'skill-gaps'],
    queryFn: () => analyticsApi.skillGaps(),
    select: (response) => response.data,
  });
};

export const useEffectiveness = () => {
  return useQuery({
    queryKey: ['analytics', 'effectiveness'],
    queryFn: () => analyticsApi.effectiveness(),
    select: (response) => response.data,
  });
};

export const useEmployeeAnalytics = (params?: { employee_id?: string; training_program_id?: string }) => {
  return useQuery({
    queryKey: ['analytics', 'employees', params],
    queryFn: () => analyticsApi.employees(params),
    select: (response) => response.data,
  });
};