import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryModel, ProductModel } from '../models';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

interface ProductState {
  listOfProducts: ProductModel[];
  listOfCategories: any[];
  isLoading: boolean;
  isCategoriesLoading: boolean;
  searchQuery: string;
  selectedCategoryName: string;

  // Pagination
  nextPageUrl: string | null;
  currentPage: number;

  // Actions
  fetchProducts: (catId?: string | number, isLoadMore?: boolean) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCategory: (name: string) => void;
  resetProductState: () => void;
}

// export const useProductStore = create<ProductState>()(
//   persist(
export const useProductStore = create<ProductState>((set, get) => ({
  listOfProducts: [],
  listOfCategories: [],
  isLoading: false,
  isCategoriesLoading: false,
  searchQuery: '',
  selectedCategoryName: 'All Categories',
  nextPageUrl: null,
  currentPage: 1,

  fetchProducts: async (catId = 'all', isLoadMore = false) => {
    const { currentPage, nextPageUrl, isLoading, searchQuery } = get();

    if (isLoading) return;
    if (isLoadMore && !nextPageUrl) return;

    set({ isLoading: true });

    try {
      const authStore = (await import('./useAuthStore')).useAuthStore.getState();
      if (!authStore.authToken || !authStore.isUserLoggedIn) return;

      const storeId = authStore.currentStore?.store_id;

      const pageToFetch = isLoadMore ? currentPage + 1 : 1;

      const response = await axiosClient.get(API_ENDPOINTS.POS.PRODUCTS, {
        params: {
          page: pageToFetch,
          store_id: storeId,
          cat_id: catId === 'all' ? null : catId,
          keyword: searchQuery || null,
        }
      });

      if (response.data?.success || response.status === 200) {
        const responseData = response.data;
        const newProducts = responseData.data?.Products || [];
        const links = responseData.links;

        set({
          listOfProducts: isLoadMore ? [...get().listOfProducts, ...newProducts] : newProducts,
          nextPageUrl: links?.next || null,
          currentPage: pageToFetch,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    const authStore = (await import('./useAuthStore')).useAuthStore.getState();
    if (!authStore.authToken || !authStore.isUserLoggedIn) return;

    set({ isCategoriesLoading: true });
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CATALOG.POS_CATEGORY);
      if (response.data?.success) {
        const categories = response.data.Products || [];
        // Add "All Categories" as default
        const formattedCats = [
          { name: 'All Categories', value: 'all' },
          ...categories.map((c: any) => ({ name: c.cat_name, value: c.cat_id }))
        ];
        set({ listOfCategories: formattedCats, isCategoriesLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
      set({ isCategoriesLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Trigger re-fetch briefly debounced or instantly as per UX
    get().fetchProducts('all', false);
  },

  setCategory: (name) => {
    set({ selectedCategoryName: name });
  },

  resetProductState: () => {
    set({
      listOfProducts: [],
      searchQuery: '',
      currentPage: 1,
      nextPageUrl: null
    });
  },
}));
//     {
//       name: 'product-catalog-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
