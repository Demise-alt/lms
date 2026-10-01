import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/services/sessions';
import { TrainingSession } from '@/types';

export const useSessions = (params?: {
  training_program_id?: string;
  trainer_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => sessionsApi.list(params),
    select: (response) => response.data,
  });
};

export const useSessionCalendar = (month: number, year: number) => {
  return useQuery({
    queryKey: ['sessions', 'calendar', month, year],
    queryFn: () => sessionsApi.getCalendar(month, year),
    select: (response) => response.data,
    enabled: month >= 1 && month <= 12 && year >= 2020,
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => sessionsApi.get(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrainingSession>) => sessionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'calendar'] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingSession> }) => sessionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'calendar'] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'calendar'] });
    },
  });
};