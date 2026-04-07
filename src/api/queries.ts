// import { useQuery } from '@tanstack/react-query';
// import axiosClient from './axiosClient';
// import { useAuthStore } from '../store/useAuthStore';
// import { API_ENDPOINTS } from '../constants/apiEndpoints';
// import { Store, POSId, Customer, Salesman, CashAccount, BankAccount, CreditCardAccount } from '../models';

// // Generic fetcher for all catalog items to maintain DRY principle
// const fetchCatalog = async <T>(endpoint: string, params?: Record<string, any>): Promise<T[]> => {
//   const baseURL = useAuthStore.getState().baseURL;
//   const token = useAuthStore.getState().authToken;
//   if (!baseURL || !token) return [];

//   const response = await axiosClient.get(`${baseURL}${endpoint}`, {
//     headers: { Authorization: `Bearer ${token}` },
//     params // optional params
//   });
//   return response.data?.success ? response.data.data : [];
// };

// export const useStores = () => {
//   return useQuery<Store[]>({
//     queryKey: ['stores'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.STORES),
//     staleTime: 1000 * 60 * 5, // 5 minutes cache
//   });
// };

// export const usePOSIDs = () => {
//   return useQuery<POSId[]>({
//     queryKey: ['posIds'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.SHIFT.POS_OPTIONS),
//     staleTime: 1000 * 60 * 10,
//   });
// };

// export const useCustomers = () => {
//   return useQuery<Customer[]>({
//     queryKey: ['customers'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CUSTOMERS),
//   });
// };

// export const useSalesman = () => {
//   return useQuery<Salesman[]>({
//     queryKey: ['salesmen'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.SHIFT.SALES_MAN),
//   });
// };

// export const useTaxes = () => {
//   const shiftId = useAuthStore.getState().currentShift?.shift_id;
//   return useQuery({
//     queryKey: ['taxes', shiftId],
//     queryFn: async () => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
//       const response = await axiosClient.get(`${baseURL}/api/tax`, {
//         params: { shift_id: shiftId },
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data; // { success: true, taxes: [...], selectedTaxes: [...] }
//     },
//     enabled: !!shiftId,
//   });
// };

// export const useCashAccounts = () => {
//   return useQuery<CashAccount[]>({
//     queryKey: ['cashAccounts'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CASH_ACCOUNTS),
//   });
// };

// export const useBankAccounts = () => {
//   return useQuery<BankAccount[]>({
//     queryKey: ['bankAccounts'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.BANK_ACCOUNTS),
//   });
// };

// export const useCreditCardAccounts = () => {
//   return useQuery<CreditCardAccount[]>({
//     queryKey: ['creditCardAccounts'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.CREDIT_CARD_ACCOUNTS),
//   });
// };

// export const useAccountHeads = () => {
//   return useQuery<any[]>({
//     queryKey: ['accountHeads'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.ACCOUNT_HEADS),
//   });
// };

// export const usePOList = () => {
//   return useQuery<any[]>({
//     queryKey: ['poList'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.PO_LIST),
//   });
// };

// // Shift Details is critical for POS - we enable auto-refetch here
// export const useShiftDetails = () => {
//   return useQuery({
//     queryKey: ['shiftDetails'],
//     queryFn: async () => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
//       const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.SHIFT.DETAILS}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     },
//     enabled: !!useAuthStore.getState().isShiftOpened,
//   });
// };
