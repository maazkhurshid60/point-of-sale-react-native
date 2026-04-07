// import { useMutation } from '@tanstack/react-query';
// import axiosClient from '../axiosClient';
// import { useAuthStore } from '../../store/useAuthStore';
// import { useCartStore } from '../../store/useCartStore';
// import { API_ENDPOINTS } from '../../constants/apiEndpoints';

// export const useAddProductByBarcodeMutation = () => {
//   const cartStore = useCartStore.getState();
//   const authStore = useAuthStore.getState();

//   return useMutation({
//     mutationFn: async (keyword: string) => {
//       const response = await axiosClient.get(`${authStore.baseURL}${API_ENDPOINTS.POS.PRODUCTS}`, {
//         params: { keyword },
//         headers: { Authorization: `Bearer ${authStore.authToken}` }
//       });
//       return response.data;
//     },
//     onSuccess: (data) => {
//       const product = data?.data?.Products?.[0];
//       if (product) {
//         cartStore.addProductToCart(product);
//       }
//     },
//   });
// };

// export const useUpdateTaxesMutation = () => {
//   const authStore = useAuthStore.getState();
//   const cartStore = useCartStore.getState();

//   return useMutation({
//     mutationFn: async () => {
//       const response = await axiosClient.post(`${authStore.baseURL}${API_ENDPOINTS.POS.UPDATE_TAX}`, {
//         shift_id: authStore.currentShift?.shift_id,
//         taxes: cartStore.activeTaxesList.map((t) => t.tax_id),
//       }, {
//         headers: { Authorization: `Bearer ${authStore.authToken}` }
//       });
//       return response.data;
//     },
//   });
// };

// export const useSearchProductMutation = () => {
//   const authStore = useAuthStore.getState();

//   return useMutation({
//     mutationFn: async (keyword: string) => {
//       const response = await axiosClient.get(`${authStore.baseURL}${API_ENDPOINTS.POS.PRODUCTS}`, {
//         params: { keyword },
//         headers: { Authorization: `Bearer ${authStore.authToken}` }
//       });
//       return response.data?.data?.Products?.[0] || null;
//     },
//   });
// };
