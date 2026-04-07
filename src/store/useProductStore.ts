// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CategoryModel } from '../models';

// interface ProductState {
//   selectedSubCategories: CategoryModel[];
//   searchQuery: string;
  
//   // Actions
//   addCategory: (category: CategoryModel) => void;
//   removeCategory: (catId: number | string) => void;
//   clearCategories: () => void;
//   setSearchQuery: (query: string) => void;
//   resetProductState: () => void;
//   fetchSingleProductDetails: (productId: number) => Promise<any>;
// }

// export const useProductStore = create<ProductState>()(
//   persist(
//     (set, get) => ({
//       selectedSubCategories: [],
//       searchQuery: '',

//       addCategory: (category) => {
//         const { selectedSubCategories } = get();
//         if (selectedSubCategories.length >= 5) {
//           throw new Error("Can't select more than (5) categories");
//         }
        
//         const exists = selectedSubCategories.some(c => c.cat_id === category.cat_id);
//         if (!exists) {
//           set({ selectedSubCategories: [...selectedSubCategories, category] });
//         }
//       },

//       removeCategory: (catId) => {
//         set({
//           selectedSubCategories: get().selectedSubCategories.filter(c => c.cat_id !== catId)
//         });
//       },

//       clearCategories: () => {
//         set({ selectedSubCategories: [] });
//       },

//       setSearchQuery: (query) => {
//         set({ searchQuery: query });
//       },

//       resetProductState: () => {
//         set({ selectedSubCategories: [], searchQuery: '' });
//       },

//       fetchSingleProductDetails: async (productId: number) => {
//         const authStore = (await import('./useAuthStore')).useAuthStore.getState();
//         const baseURL = authStore.baseURL;
//         const token = authStore.authToken;
//         const { default: axiosClient } = await import('../api/axiosClient');

//         const response = await axiosClient.get(`${baseURL}/api/productdetails`, {
//           params: { id: productId },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data?.success) {
//           const data = response.data;
//           const productData: any = {
//             record: data.record,
//             variants: data.variants,
//             productasset: data.productasset,
//             store_total: data.store_total,
//             warehouse_total: data.warehouse_total,
//           };

//           // Handle store data conversion (matching Flutter logic)
//           if (data.store && typeof data.store === 'object' && !Array.isArray(data.store)) {
//             productData.store = Object.values(data.store);
//           } else {
//             productData.store = data.store || [];
//           }

//           // Handle warehouse data conversion (matching Flutter logic)
//           if (data.warehouse && typeof data.warehouse === 'object' && !Array.isArray(data.warehouse)) {
//             productData.warehouse = Object.values(data.warehouse);
//           } else {
//             productData.warehouse = data.warehouse || [];
//           }

//           return productData;
//         } else {
//           throw new Error(response.data?.message || 'Failed to load product details');
//         }
//       },
//     }),
//     {
//       name: 'product-catalog-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
