// import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
// import { API_ENDPOINTS } from '../../constants/apiEndpoints';
// import { SaleHistoryItem, SaleDetails } from '../../models';
// import axiosClient from '../axiosClient';
// import { useAuthStore } from '../../store/useAuthStore';

// export const useInfiniteSales = (filters: {
//   startDate?: string | null;
//   endDate?: string | null;
//   customerId?: number | null;
//   shiftId?: number | null;
// }) => {
//   const storeId = useAuthStore.getState().currentStore?.store_id;

//   return useInfiniteQuery({
//     queryKey: ['sales-history', filters],
//     queryFn: async ({ pageParam = 1 }) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
      
//       const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.CATALOG.SALESLIST}`, {
//         params: {
//           page: pageParam,
//           store_id: storeId,
//           start_date: filters.startDate,
//           end_date: filters.endDate,
//           customer_id: filters.customerId,
//           shift_id: filters.shiftId,
//         },
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const responseData = response.data;
//       const sales = responseData.sales.data.map((s: any) => s as SaleHistoryItem);
//       const nextLink = responseData.sales.next_page_url;
      
//       let nextPage = undefined;
//       if (nextLink) {
//         const url = new URL(nextLink);
//         nextPage = Number(url.searchParams.get('page'));
//       }

//       return {
//         sales,
//         nextPage,
//         total: responseData.sales.total,
//       };
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// };

// export const useInfiniteHoldSales = () => {
//   const storeId = useAuthStore.getState().currentStore?.store_id;

//   return useInfiniteQuery({
//     queryKey: ['hold-sales'],
//     queryFn: async ({ pageParam = 1 }) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
      
//       const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.CATALOG.DRAFT_SALES_LIST}`, {
//         params: {
//           page: pageParam,
//           store_id: storeId,
//         },
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const responseData = response.data;
//       const draftData = responseData.draft;
//       const sales = draftData.data.map((s: any) => s as SaleHistoryItem);
//       const nextLink = draftData.next_page_url;
      
//       let nextPage = undefined;
//       if (nextLink) {
//         const url = new URL(nextLink);
//         nextPage = Number(url.searchParams.get('page'));
//       }

//       return {
//         sales,
//         nextPage,
//       };
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// };

// export const useSaleDetails = (saleId: number | string, type: string = '') => {
//   return useQuery<SaleDetails>({
//     queryKey: ['sale-details', saleId, type],
//     queryFn: async () => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
      
//       const response = await axiosClient.post(`${baseURL}${API_ENDPOINTS.POS.GET_INVOICE}`, null, {
//         params: {
//           id: saleId,
//           invoice_type: type,
//         },
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const responseData = response.data;
//       if (!responseData.success) throw new Error(responseData.message || 'Failed to fetch invoice');
      
//       const result = responseData.result;
//       const saleData = result.sale[0];
      
//       return {
//         sale: saleData,
//         sale_items: saleData.sale_items,
//         customer: saleData.customer,
//         user: saleData.user,
//         salesman: saleData.salesman,
//         company: result.company,
//         settings: result.settings,
//       };
//     },
//     enabled: !!saleId,
//   });
// };
