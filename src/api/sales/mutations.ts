// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import axiosClient from '../axiosClient';
// import { useAuthStore } from '../../store/useAuthStore';
// import { API_ENDPOINTS } from '../../constants/apiEndpoints';

// export const useDeleteDraftSale = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (saleId: number | string) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;

//       // In Flutter: await dio.delete('$baseUrl/api/deletedraftsale', data: {'id': saleId}, ...)
//       const response = await axiosClient.post(`${baseURL}/api/deletedraftsale`, { id: saleId }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['hold-sales'] });
//     },
//   });
// };

// export const useUpdateTaxes = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (taxes: number[]) => {
//       const baseURL = useAuthStore.getState().baseURL;
//       const token = useAuthStore.getState().authToken;
//       const shiftId = useAuthStore.getState().currentShift?.shift_id;

//       const response = await axiosClient.post(`${baseURL}/api/updatetax`, {
//         shift_id: shiftId,
//         taxes: taxes,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['shiftDetails'] });
//     },
//   });
// };
