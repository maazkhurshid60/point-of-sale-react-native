import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const useShiftDetails = () => {
  return useQuery({
    queryKey: ['shiftDetails'],
    queryFn: async () => {
      const baseURL = useAuthStore.getState().baseURL;
      const token = useAuthStore.getState().authToken;
      const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.SHIFT.DETAILS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!useAuthStore.getState().isShiftOpened,
  });
};
