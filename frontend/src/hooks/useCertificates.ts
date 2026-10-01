import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from '@/services/certificates';
import { Certificate } from '@/types';

export const useCertificates = (params?: { employee_id?: string; training_program_id?: string }) => {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => certificatesApi.list(params),
    select: (response) => response.data,
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ['certificates', id],
    queryFn: () => certificatesApi.get(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useIssueCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { employee_id: string; training_program_id: string; expiry_date?: string; issuer_name?: string }) =>
      certificatesApi.issue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useRevokeCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificatesApi.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useVerifyCertificate = () => {
  return useMutation({
    mutationFn: (certificateNumber: string) => certificatesApi.verify(certificateNumber),
  });
};