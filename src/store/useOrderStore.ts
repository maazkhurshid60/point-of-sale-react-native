import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { GeneralOrder } from "../models";

interface OrderStore {
  orders: GeneralOrder[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // Actions
  fetchOrders: (page?: number) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  fetchOrders: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CATALOG.GET_ALL_ORDERS, {
        params: { page }
      });

      if (response.data?.success && response.data.orders) {
        const { data, current_page, last_page, total, next_page_url, prev_page_url } = response.data.orders;
        
        set({
          orders: data,
          pagination: {
            currentPage: current_page,
            lastPage: last_page || 1,
            total: total || 0,
            hasNextPage: !!next_page_url,
            hasPrevPage: !!prev_page_url,
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
