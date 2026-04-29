import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { Customer } from "../models";

interface CustomerState {
  customers: Customer[];

  // Actions
  fetchCustomers: () => Promise<Customer[]>;
  searchCustomers: (query: string) => Promise<Customer[]>;
  addNewCustomer: (details: any) => Promise<{ success: boolean; message?: string }>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],

  fetchCustomers: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CUSTOMERS);
      const customers: Customer[] = res.data?.success ? res.data.customers : [];
      set({ customers });
      return customers;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  searchCustomers: async (query) => {
    try {
      if (!query.trim()) return get().fetchCustomers();
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.SEARCH_CUSTOMER, {
        params: { query },
      });
      return res.data?.data || res.data?.customers || [];
    } catch (e) {
      console.error("Search customers error:", e);
      return [];
    }
  },

  addNewCustomer: async (details) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.CATALOG.ADD_CUSTOMER, null, {
        params: details,
      });

      if (res.data?.success) {
        return { success: true };
      }

      return {
        success: false,
        message: res.data?.message || res.data?.error || "Failed to add customer",
      };
    } catch (e: any) {
      console.error("Add customer error:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join("\n")
          : null) ||
        "An unexpected error occurred while adding the customer.";
      return { success: false, message: errorMessage };
    }
  },
}));
