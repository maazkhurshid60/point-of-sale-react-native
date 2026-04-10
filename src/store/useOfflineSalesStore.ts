import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineSale {
  sale_id: string;
  shift_id: number;
  customer_id: number;
  products: string; // JSON string of products array
  total: number;
  sale_items: any[];
  actual_products: any[];
  created_at: string;
}

interface OfflineSalesState {
  sales: OfflineSale[];
  
  // Actions
  addOfflineSale: (sale: OfflineSale) => void;
  removeOfflineSale: (saleId: string) => void;
  clearAllSales: () => void;
  setSales: (sales: OfflineSale[]) => void;
}

export const useOfflineSalesStore = create<OfflineSalesState>()(
  persist(
    (set) => ({
      sales: [],

      addOfflineSale: (sale) => set((state) => ({
        sales: [...state.sales, sale]
      })),

      removeOfflineSale: (saleId) => set((state) => ({
        sales: state.sales.filter((s) => s.sale_id !== saleId)
      })),

      clearAllSales: () => set({ sales: [] }),

      setSales: (sales) => set({ sales }),
    }),
    {
      name: 'offline-sales-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
