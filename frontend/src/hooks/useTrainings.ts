import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingsApi } from '@/services/trainings';
import { TrainingProgram, Course, Module } from '@/types';

export const useTrainings = (params?: { status?: string; department_id?: string }) => {
  return useQuery({
    queryKey: ['trainings', params],
    queryFn: () => trainingsApi.list(params),
    select: (response) => response.data,
  });
};

export const useTraining = (id: string) => {
  return useQuery({
    queryKey: ['trainings', id],
    queryFn: () => trainingsApi.get(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrainingProgram>) => trainingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingProgram> }) => trainingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trainingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
  });
};

// Courses
export const useCourses = (programId: string) => {
  return useQuery({
    queryKey: ['courses', programId],
    queryFn: () => trainingsApi.listCourses(programId),
    select: (response) => response.data,
    enabled: !!programId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ programId, data }: { programId: string; data: Partial<Course> }) => trainingsApi.createCourse(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: Partial<Course> }) => trainingsApi.updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => trainingsApi.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Modules
export const useModules = (courseId: string) => {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => trainingsApi.listModules(courseId),
    select: (response) => response.data,
    enabled: !!courseId,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: Partial<Module> }) => trainingsApi.createModule(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: Partial<Module> }) => trainingsApi.updateModule(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) => trainingsApi.deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
};