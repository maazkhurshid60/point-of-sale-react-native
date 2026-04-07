// import { useCartStore } from '../store/useCartStore';
// import { useOfflineSalesStore } from '../store/useOfflineSalesStore';
// import { OfflineSale, ProductModel, CartItemModel } from '../models';
// import { useNetworkStore } from '../store/useNetworkStore';
// import axiosClient from '../api/axiosClient';
// import { useAuthStore } from '../store/useAuthStore';
// import { API_ENDPOINTS } from '../constants/apiEndpoints';

// export const useOfflineSalesActions = () => {
//   const cartStore = useCartStore();
//   const offlineStore = useOfflineSalesStore();
//   const networkStore = useNetworkStore();
//   const authStore = useAuthStore();

//   const gapAnalysis = async (sale: OfflineSale) => {
//     // Check internet connectivity
//     if (!networkStore.isInternetReachable) {
//       throw new Error('Internet is not connected. Kindly connect to internet.');
//     }

//     const listOfFetchedProducts: ProductModel[] = [];
//     let totalAmount = 0;

//     try {
//       for (const item of sale.sale_items) {
//         const response = await axiosClient.get(`${authStore.baseURL}${API_ENDPOINTS.POS.PRODUCTS}`, {
//           params: { keyword: item.barcode },
//           headers: { Authorization: `Bearer ${authStore.authToken}` }
//         });

//         const product: ProductModel = response.data?.data?.Products?.[0];
//         if (product) {
//           listOfFetchedProducts.push(product);
//           totalAmount += product.selling_price * item.qty;
//         } else {
//           // If product not found on server anymore, we might need a fallback or handle error
//           console.warn(`Product with barcode ${item.barcode} not found during gap analysis.`);
//         }
//       }

//       return {
//         total: totalAmount,
//         listOfProducts: listOfFetchedProducts,
//       };
//     } catch (error) {
//       console.error('Gap analysis failed:', error);
//       throw error;
//     }
//   };

//   const loadSaleToCart = (sale: OfflineSale) => {
//     cartStore.clearCart();

//     const newCartItems: CartItemModel[] = sale.sale_items.map((item, index) => {
//       // Find the corresponding product from the saved actual_products
//       const product = sale.actual_products.find((p) => p.product_id === item.product_id) 
//                    || sale.actual_products[index]; // Fallback to index if mapping is weird

//       return {
//         product_id: item.product_id,
//         product_name: product.product_name,
//         product: product,
//         quantity: item.qty,
//         selling_price: item.price,
//         discount: item.discount || 0,
//       };
//     });

//     // Set cart state
//     useCartStore.setState({
//       cartItemsList: newCartItems,
//       currentSaleHandler: 'new-sale', // Flutter resets to 'new-sale' after loading
//       isFromOfflineSale: true,
//       offlineSaleId: sale.sale_id,
//     });

//     cartStore.recalculateAmountAndTax();
//   };

//   const saveCurrentCartAsOffline = () => {
//     // This would be called when user presses "Pay" in offline mode
//     // Implementation depends on the Checkout flow, but here is the logic:
//     const { cartItemsList, totalAmountToPay, totalDiscount, calculatedTaxAmount, selectedCustomer } = cartStore;
//     const { currentShift } = authStore;

//     const offlineSale: OfflineSale = {
//       sale_id: Date.now(), // Unique ID using timestamp
//       discount_type: authStore.softwareSettings?.discount_type || 'amount',
//       discount_policy: 'none', // Adjust based on requirement
//       shift_id: currentShift?.shift_id || 0,
//       customer_id: typeof selectedCustomer === 'number' ? selectedCustomer : 0, 
//       total: totalAmountToPay,
//       cash_account_id: currentShift?.default_cash_account || 0,
//       store_id: currentShift?.store?.store_id || 0,
//       cash_amount: totalAmountToPay, // Assuming full cash for offline
//       overall_discount: totalDiscount,
//       overall_tax: calculatedTaxAmount,
//       salesman_id: currentShift?.salesman_id || 0,
//       draft_id: `OFF-${Date.now()}`,
//       sale_items: cartItemsList.map(item => ({
//         product_id: item.product_id,
//         barcode: item.product.barcode,
//         qty: item.quantity,
//         price: item.selling_price,
//         total: item.selling_price * item.quantity,
//         tax: 0, // Simplified for now
//         discount: item.discount
//       })),
//       actual_products: cartItemsList.map(item => item.product),
//       created_at: new Date().toISOString(),
//     };

//     offlineStore.addOfflineSale(offlineSale);
//     cartStore.clearCart();
//   };

//   return {
//     gapAnalysis,
//     loadSaleToCart,
//     saveCurrentCartAsOffline,
//   };
// };
