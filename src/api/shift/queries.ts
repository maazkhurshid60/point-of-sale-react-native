import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { useShiftStore } from '../../store/useShiftStore';
import { POSId, Salesman } from '../../models';

// Helper for catalog-style shift options
const fetchShiftOption = async <T>(endpoint: string): Promise<T[]> => {
  const response = await axiosClient.get(endpoint);
  return response.data?.success ? (response.data.data ?? response.data.fbr ?? response.data.saleman ?? []) : [];
};

export const usePOSIDs = () => {
  return useQuery<POSId[]>({
    queryKey: ['posIds'],
    queryFn: () => fetchShiftOption(API_ENDPOINTS.SHIFT.POS_OPTIONS),
    staleTime: 1000 * 60 * 10,
  });
};

export const useSalesman = () => {
  return useQuery<Salesman[]>({
    queryKey: ['salesmen'],
    queryFn: () => fetchShiftOption(API_ENDPOINTS.SHIFT.SALES_MAN),
  });
};

export const useShiftDetails = (shiftId?: number) => {
  return useQuery({
    queryKey: ['shiftDetails', shiftId],
    queryFn: async () => {
      if (!shiftId) return null;
      const res = await axiosClient.get(API_ENDPOINTS.SHIFT.DETAILS, {
        params: { shift_id: shiftId }
      });
      return res.data;
    },
    enabled: !!shiftId,
  });
};

export const useUpdateCashManagement = () => {
  const queryClient = useQueryClient();
  const currentShift = useShiftStore(state => state.currentShift);

  return useMutation({
    mutationFn: async ({ paidIn, paidOut, notes }: { paidIn: string, paidOut: string, notes: string }) => {
      if (!currentShift) throw new Error("No active shift");
      const res = await axiosClient.get(API_ENDPOINTS.TRANSACTIONS.PAID_IN_OUT, {
        params: { 
          shift_id: currentShift.shift_id, 
          paid_in: paidIn, 
          paid_out: paidOut, 
          note: notes 
        }
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to update cash management');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
    }
  });
};
