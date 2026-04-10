import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { KitchenOrder, KitchenProduct } from '../../models';
import axiosClient from '../axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { getMockKitchenOrders } from '../../store/useKitchenStore';

/**
 * useKitchenOrdersQuery
 * Fetches active kitchen orders with a periodic refetch interval (30s)
 */
export const useKitchenOrdersQuery = () => {
  const storeId = useAuthStore.getState().currentStore?.store_id;

  return useQuery({
    queryKey: ['kitchen-orders', storeId],
    queryFn: async (): Promise<KitchenOrder[]> => {
      try {
        const token = useAuthStore.getState().authToken;
        console.log(token, "Auth Token")
        if (!token) return getMockKitchenOrders();

        const response = await axiosClient.get(API_ENDPOINTS.CATALOG.KITCHEN_ORDERS, {
          params: { store_id: storeId }
        });

        console.log(response.data, "Kitchen Orders")

        if (response.data && response.data.orders) {
          return response.data.orders.map((o: any) => o as KitchenOrder);
        }

        // If data format is unexpected, handle gracefully
        return response.data?.success ? (response.data.data ?? []) : getMockKitchenOrders();
      } catch (e) {
        console.warn("Kitchen API error, falling back to mock data.", e);
        return getMockKitchenOrders();
      }
    },
    // Kitchen screens need frequent updates
    refetchInterval: 30000,
    staleTime: 5000,
  });
};

/**
 * useUpdateKitchenStatusMutation
 * Updates the overall status of an order (ToDo -> InProgress -> Done)
 */
export const useUpdateKitchenStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: KitchenOrder['status'] }) => {
      const response = await axiosClient.post(API_ENDPOINTS.POS.UPDATE_KITCHEN_ORDER, {
        order_id: orderId,
        status,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    }
  });
};

/**
 * useUpdateKitchenItemStatusMutation
 * Updates the status of an individual item within an order
 */
export const useUpdateKitchenItemStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, productId, status }: { orderId: number; productId: number; status: KitchenProduct['status'] }) => {
      const response = await axiosClient.post(API_ENDPOINTS.POS.UPDATE_KITCHEN_ORDER, {
        order_id: orderId,
        product_id: productId,
        item_status: status,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    }
  });
};
