import axiosClient from './axiosClient';
import { useAuthStore } from '../store/useAuthStore';

export const fetchCatalog = async <T>(endpoint: string): Promise<T[]> => {
  const baseURL = useAuthStore.getState().baseURL;
  const token = useAuthStore.getState().authToken;
  if (!baseURL || !token) return [];

  const response = await axiosClient.get(`${baseURL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data?.success ? response.data.data : [];
};
