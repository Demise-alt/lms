import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi } from '@/services/assessments';
import { Assessment, AssessmentAttempt } from '@/types';

export const useAssessments = (params?: {
  training_program_id?: string;
  module_id?: string;
  assessment_type?: string;
}) => {
  return useQuery({
    queryKey: ['assessments', params],
    queryFn: () => assessmentsApi.list(params),
    select: (response) => response.data,
  });
};

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: ['assessments', id],
    queryFn: () => assessmentsApi.get(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assessment> & { questions?: Partial<{ [key: string]: any }>[] }) =>
      assessmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assessment> }) =>
      assessmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useStartAssessmentAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assessmentId, employeeId }: { assessmentId: string; employeeId: string }) =>
      assessmentsApi.startAttempt(assessmentId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentAttempts'] });
    },
  });
};

export const useSubmitAssessmentAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: { question_id: string; selected_answer: string }[] }) =>
      assessmentsApi.submitAttempt(attemptId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentAttempts'] });
    },
  });
};