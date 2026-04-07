// import { useCartStore } from '../store/useCartStore';
// import { useAuthStore } from '../store/useAuthStore';
// import { useSaleDetails } from '../api/sales/queries';
// import { useDeleteDraftSale } from '../api/sales/mutations';
// import { SaleHistoryItem, CartItemModel } from '../models';

// export const useHoldSalesActions = () => {
//   const cartStore = useCartStore();
//   const authStore = useAuthStore();
//   const deleteMutation = useDeleteDraftSale();

//   const loadHoldSale = async (sale: SaleHistoryItem) => {
//     // We use the already defined useSaleDetails logic but as a manual fetch
//     // To keep it simple, we'll fetch the invoice data
//     const baseURL = authStore.baseURL;
//     const token = authStore.authToken;
    
//     try {
//       // Fetch full details
//       const response = await fetch(`${baseURL}/api/get_invoice?id=${sale.sale_id}&invoice_type=`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         const saleData = data.result.sale[0];
//         const saleItems = saleData.sale_items;

//         cartStore.clearCart();

//         const newCartItems: CartItemModel[] = saleItems.map((item: any) => ({
//           product_id: item.product.product_id,
//           product_name: item.product.product_name,
//           product: item.product,
//           quantity: item.qty,
//           selling_price: item.actual_price,
//           discount: item.discount_amount || 0,
//         }));

//         // Update cart store directly for complex state
//         useCartStore.setState({
//           cartItemsList: newCartItems,
//           currentSaleHandler: sale.sale_id.toString(),
//           selectedCustomer: saleData.customer.name,
//           selectedCustomerId: saleData.customer.customer_id,
//         });

//         cartStore.recalculateAmountAndTax();
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Failed to load hold sale:', error);
//       return false;
//     }
//   };

//   const deleteHoldSale = async (saleId: number) => {
//     return deleteMutation.mutateAsync(saleId);
//   };

//   return {
//     loadHoldSale,
//     deleteHoldSale,
//     isDeleting: deleteMutation.isPending,
//   };
// };
