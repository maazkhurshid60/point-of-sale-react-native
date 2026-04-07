import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const useOpenShiftMutation = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore.getState();

  return useMutation({
    mutationFn: async ({ storeId, amount, posId }: { storeId: number; amount: number; posId: string }) => {
      const response = await axiosClient.post(`${authStore.baseURL}${API_ENDPOINTS.SHIFT.OPEN}`, {
        store_id: storeId,
        opening_balance: amount,
        fbr_pos_id: posId,
      }, {
        headers: { Authorization: `Bearer ${authStore.authToken}` }
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        useAuthStore.setState({ isShiftOpened: true, currentShift: data.data });
        queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
      }
    },
  });
};

export const useCloseShiftMutation = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore.getState();

  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await axiosClient.post(`${authStore.baseURL}${API_ENDPOINTS.SHIFT.CLOSE}`, {
        closing_balance: amount,
      }, {
        headers: { Authorization: `Bearer ${authStore.authToken}` }
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        useAuthStore.setState({ isShiftOpened: false, currentShift: null });
        queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
      }
    },
  });
};

export const useUpdateCashManagementMutation = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore.getState();

  return useMutation({
    mutationFn: async ({ paidIn, paidOut, notes }: { paidIn: number; paidOut: number; notes: string }) => {
      const response = await axiosClient.get(`${authStore.baseURL}${API_ENDPOINTS.TRANSACTIONS.PAID_IN_OUT}`, {
        params: {
          shift_id: authStore.currentShift?.shift_id,
          paid_in: paidIn,
          paid_out: paidOut,
          note: notes,
        },
        headers: { Authorization: `Bearer ${authStore.authToken}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
      }
    },
  });
};

export const useAddPosExpenseMutation = () => {
  const authStore = useAuthStore.getState();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'deposit_slip_file' && data[key]?.uri) {
            formData.append('supplier_deposit_slip', {
              uri: data[key].uri,
              name: data['deposit_slip_filename'] || 'deposit_slip.jpg',
              type: data[key].mimeType || 'image/jpeg'
            } as any);
          } else if (key !== 'deposit_slip_file' && key !== 'deposit_slip_filename') {
            formData.append(key, data[key]);
          }
        }
      });
      // always append shift_id
      formData.append('shift_id', authStore.currentShift?.shift_id as any);

      const response = await axiosClient.post(`${authStore.baseURL}/api/addposexpanse`, formData, {
        headers: {
          Authorization: `Bearer ${authStore.authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};
