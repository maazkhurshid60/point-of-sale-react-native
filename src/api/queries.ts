import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from './axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Store, POSId, Customer, Salesman, CashAccount, BankAccount, CreditCardAccount } from '../models';

// Generic fetcher for all catalog items
const fetchCatalog = async <T>(endpoint: string, params?: Record<string, any>): Promise<T[]> => {
  const response = await axiosClient.get(endpoint, { params });
  return response.data?.success ? (response.data.data ?? response.data.stores ?? response.data.accounts ?? response.data.customers ?? response.data.saleman ?? []) : [];
};

export const useStores = () => {
  return useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get(API_ENDPOINTS.CATALOG.STORES);
        return (res.data?.success && res.data.store) ? res.data.store : [];
      } catch (e) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePOSIDs = () => {
  return useQuery<POSId[]>({
    queryKey: ['posIds'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get(API_ENDPOINTS.SHIFT.POS_OPTIONS);
        return (res.data?.success && res.data.fbr) ? res.data.fbr : [];
      } catch (e) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CUSTOMERS),
  });
};

export const useSalesman = () => {
  return useQuery<Salesman[]>({
    queryKey: ['salesmen'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.SHIFT.SALES_MAN),
  });
};

export const useCashAccounts = () => {
  return useQuery<CashAccount[]>({
    queryKey: ['cashAccounts'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CASH_ACCOUNTS),
  });
};

export const useBankAccounts = () => {
  return useQuery<BankAccount[]>({
    queryKey: ['bankAccounts'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.BANK_ACCOUNTS),
  });
};

export const useCreditCardAccounts = () => {
  return useQuery<CreditCardAccount[]>({
    queryKey: ['creditCardAccounts'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CREDIT_CARD_ACCOUNTS),
  });
};

export const useShiftDetails = (shiftId?: number) => {
  return useQuery({
    queryKey: ['shiftDetails', shiftId],
    queryFn: async () => {
      if (!shiftId) return null;
      console.log("[useShiftDetails] Fetching for ID:", shiftId, "Type:", typeof shiftId);
      const res = await axiosClient.get(API_ENDPOINTS.SHIFT.DETAILS, {
        params: { shift_id: shiftId }
      });
      console.log("[useShiftDetails] Response:", res.data);
      return res.data; // Return everything, even if success is false
    },
    enabled: !!shiftId,
  });
};

export const useUpdateCashManagement = () => {
  const queryClient = useQueryClient();
  const currentShift = useAuthStore(state => state.currentShift);

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
      // Invalidate the shift details query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
    }
  });
};
