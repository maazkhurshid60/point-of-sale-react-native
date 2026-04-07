// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { API_ENDPOINTS } from '../../constants/apiEndpoints';
// import { KitchenOrder, KitchenProduct } from '../../models';
// import axiosClient from '../axiosClient';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useKitchenStore, getMockKitchenOrders } from '../../store/useKitchenStore';

// /**
//  * useKitchenOrdersQuery
//  * Fetches active kitchen orders with a periodic refetch interval (30s)
//  */
// export const useKitchenOrdersQuery = () => {
//   const storeId = useAuthStore.getState().currentStore?.store_id;

//   return useQuery({
//     queryKey: ['kitchen-orders', storeId],
//     queryFn: async (): Promise<KitchenOrder[]> => {
//       // In a real environment, this would call a real endpoint.
//       // If endpoint is missing, we return mock data for development.
//       try {
//         const baseURL = useAuthStore.getState().baseURL;
//         const token = useAuthStore.getState().authToken;

//         if (!baseURL || !token) return getMockKitchenOrders();

//         const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.CATALOG.KITCHEN_ORDERS || '/api/get-kitchen-orders'}`, {
//           params: { store_id: storeId },
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const data = response.data;
//         if (data && data.orders) {
//           return data.orders.map((o: any) => o as KitchenOrder);
//         }
        
//         return getMockKitchenOrders(); 
//       } catch (e) {
//         console.warn("Kitchen API not found, falling back to mock data.");
//         return getMockKitchenOrders();
//       }
//     },
//     // Kitchen screens need frequent updates
//     refetchInterval: 30000, 
//     staleTime: 5000,
//   });
// };

// /**
//  * useUpdateKitchenStatusMutation
//  * Updates the overall status of an order (ToDo -> InProgress -> Done)
//  */
// export const useUpdateKitchenStatusMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ orderId, status }: { orderId: number; status: KitchenOrder['status'] }) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
      
//       const response = await axiosClient.post(`${baseURL}${API_ENDPOINTS.POS.UPDATE_KITCHEN_ORDER || '/api/update-order-status'}`, {
//         order_id: orderId,
//         status,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
//     }
//   });
// };

// /**
//  * useUpdateKitchenItemStatusMutation
//  * Updates the status of an individual item within an order
//  */
// export const useUpdateKitchenItemStatusMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ orderId, productId, status }: { orderId: number; productId: number; status: KitchenProduct['status'] }) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;

//       const response = await axiosClient.post(`${baseURL}${API_ENDPOINTS.POS.UPDATE_KITCHEN_ORDER || '/api/update-order-status'}`, {
//         order_id: orderId,
//         product_id: productId,
//         item_status: status,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
//     }
//   });
// };
