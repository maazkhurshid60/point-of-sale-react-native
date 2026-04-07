// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface SalesState {
//   startDate: string | null;
//   endDate: string | null;
//   selectedCustomerId: number | null;
//   selectedShiftId: number | null;
//   searchInvoice: string;
  
//   // Actions
//   setFilters: (filters: Partial<Omit<SalesState, 'setFilters' | 'resetFilters'>>) => void;
//   resetFilters: () => void;
// }

// export const useSalesStore = create<SalesState>()(
//   persist(
//     (set) => ({
//       startDate: null,
//       endDate: null,
//       selectedCustomerId: null,
//       selectedShiftId: null,
//       searchInvoice: '',

//       setFilters: (filters) => set((state) => ({ ...state, ...filters })),
      
//       resetFilters: () => set({
//         startDate: null,
//         endDate: null,
//         selectedCustomerId: null,
//         selectedShiftId: null,
//         searchInvoice: '',
//       }),
//     }),
//     {
//       name: 'sales-history-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
