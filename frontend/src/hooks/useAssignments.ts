import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/services/assignments';
import { Assignment, AssignmentSubmission } from '@/types';

export const useAssignments = (params?: {
  training_program_id?: string;
  course_id?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentsApi.list(params),
    select: (response) => response.data,
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: () => assignmentsApi.get(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assignment>) => assignmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) =>
      assignmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

// Submissions
export const useAssignmentSubmissions = (assignmentId: string, params?: {
  employee_id?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['assignmentSubmissions', assignmentId, params],
    queryFn: () => assignmentsApi.listSubmissions(assignmentId, params),
    select: (response) => response.data,
    enabled: !!assignmentId,
  });
};

export const useCreateAssignmentSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AssignmentSubmission>) =>
      assignmentsApi.createSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions'] });
    },
  });
};

export const useUpdateAssignmentSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: string; data: Partial<AssignmentSubmission> }) =>
      assignmentsApi.updateSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions'] });
    },
  });
};

// Employee assignments
export const useEmployeeAssignments = (employeeId: string, params?: { status?: string }) => {
  return useQuery({
    queryKey: ['employeeAssignments', employeeId, params],
    queryFn: () => assignmentsApi.getEmployeeAssignments(employeeId, params),
    select: (response) => response.data,
    enabled: !!employeeId,
  });
};