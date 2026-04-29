import { useQuery } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { useShiftStore } from '../../store/useShiftStore';

export const useSales = (filters: any, page: number = 1) => {
  const currentShift = useShiftStore(state => state.currentShift);

  return useQuery({
    queryKey: ['sales', filters, page, currentShift?.shift_id],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.CATALOG.SALESLIST, {
        params: {
          page,
          sale_type: filters.saleType,
          shift_id: currentShift?.shift_id,
          date: filters.date,
          customer: filters.customerId,
          invoice: filters.invoiceNo,
        }
      });
      return response.data?.records || { data: [], total: 0 };
    },
  });
};
