import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../axiosClient';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { Store, Customer, CashAccount, BankAccount, CreditCardAccount } from '../../models';

// Generic fetcher for catalog items
const fetchCatalog = async <T>(endpoint: string): Promise<T[]> => {
  const response = await axiosClient.get(endpoint);
  return response.data?.success ? (response.data.data ?? response.data.stores ?? response.data.accounts ?? response.data.customers ?? []) : [];
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

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CUSTOMERS),
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

export const useOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.CATALOG.GET_ALL_ORDERS, {
        params: { page }
      });
      return response.data?.orders || { data: [], total: 0 };
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      console.log("Deleting order:", orderId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
