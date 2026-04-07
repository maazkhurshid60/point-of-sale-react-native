// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { OfflineSale } from '../models';

// interface OfflineSalesState {
//   sales: OfflineSale[];
//   offlineSalesLimit: number;
  
//   // Actions
//   addOfflineSale: (sale: OfflineSale) => void;
//   deleteOfflineSale: (saleId: number) => void;
//   clearAllOfflineSales: () => void;
//   getUsedOfflineSalesCount: () => number;
//   getFilteredSales: (options: {
//     selectedDate?: string;
//     minPrice?: number;
//     maxPrice?: number;
//     customerId?: number;
//   }) => OfflineSale[];
// }

// export const useOfflineSalesStore = create<OfflineSalesState>()(
//   persist(
//     (set, get) => ({
//       sales: [],
//       offlineSalesLimit: 1000,

//       addOfflineSale: (sale) => {
//         const { sales, offlineSalesLimit } = get();
//         if (sales.length < offlineSalesLimit) {
//           set({ sales: [...sales, sale] });
//         } else {
//           console.warn('Offline sales limit reached');
//         }
//       },

//       deleteOfflineSale: (saleId) => {
//         set({ sales: get().sales.filter((s) => s.sale_id !== saleId) });
//       },

//       clearAllOfflineSales: () => {
//         set({ sales: [] });
//       },

//       getUsedOfflineSalesCount: () => {
//         return get().sales.length;
//       },

//       getFilteredSales: ({ selectedDate, minPrice, maxPrice, customerId }) => {
//         let filtered = get().sales;

//         if (selectedDate) {
//           filtered = filtered.filter((sale) => {
//             const saleDate = sale.created_at.split('T')[0];
//             return saleDate === selectedDate;
//           });
//         }

//         if (minPrice !== undefined && maxPrice !== undefined && maxPrice > minPrice) {
//           filtered = filtered.filter((sale) => {
//             return sale.total >= minPrice && sale.total <= maxPrice;
//           });
//         }

//         if (customerId !== undefined) {
//           filtered = filtered.filter((sale) => sale.customer_id === customerId);
//         }

//         return filtered;
//       },
//     }),
//     {
//       name: 'offline-sales-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
