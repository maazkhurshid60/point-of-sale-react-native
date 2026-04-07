// import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
// import { API_ENDPOINTS } from '../../constants/apiEndpoints';
// import { Store, POSId, Customer, Salesman, CashAccount, BankAccount, CreditCardAccount, CategoryModel, ProductModel } from '../../models';
// import { fetchCatalog } from '../baseFetcher';
// import axiosClient from '../axiosClient';
// import { useAuthStore } from '../../store/useAuthStore';

// export const useStores = () => {
//   return useQuery<Store[]>({
//     queryKey: ['stores'],
//     queryFn: () => fetchCatalog(API_ENDPOINTS.CATALOG.STORES),
//     staleTime: 1000 * 60 * 5,
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

// export const useCategories = () => {
//   return useQuery<CategoryModel[]>({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
//       const res = await axiosClient.get(`${baseURL}${API_ENDPOINTS.CATALOG.POS_CATEGORY}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return res.data?.success ? res.data.Products : [];
//     },
//     staleTime: 1000 * 60 * 30, // 30 minutes
//   });
// };

// export const useInfiniteProducts = (catId?: number | string, keyword?: string) => {
//   const storeId = useAuthStore.getState().currentStore?.store_id;

//   return useInfiniteQuery({
//     queryKey: ['products', catId, keyword],
//     queryFn: async ({ pageParam = 1 }) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;

//       const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.POS.PRODUCTS}`, {
//         params: {
//           page: pageParam,
//           store_id: storeId,
//           cat_id: catId === 'all' ? null : catId,
//           keyword: keyword || null,
//         },
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const responseData = response.data;
//       const data = responseData.data;
//       const products = data.Products.map((p: any) => p as ProductModel);
//       const nextLink = responseData.links.next;

//       // Extract page number from next link if it exists
//       let nextPage = undefined;
//       if (nextLink) {
//         const url = new URL(nextLink);
//         nextPage = Number(url.searchParams.get('page'));
//       }

//       return {
//         products,
//         nextPage,
//         total: data.total,
//       };
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// };
