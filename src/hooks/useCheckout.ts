// import { useMutation } from '@tanstack/react-query';
// import axiosClient from '../api/axiosClient';
// import { useAuthStore } from '../store/useAuthStore';
// import { useCartStore } from '../store/useCartStore';
// import { usePaymentStore } from '../store/usePaymentStore';
// import { API_ENDPOINTS } from '../constants/apiEndpoints';
// import { SoftwareSettings } from '../models';

// export const useCheckout = () => {
//   const authStore = useAuthStore.getState();
//   const cartStore = useCartStore.getState();
//   const paymentStore = usePaymentStore.getState();

//   const checkoutMutation = useMutation({
//     mutationFn: async (identifier: 'ticket' | 'invoice') => {
//       const { cartItemsList, totalAmountToPayWithoutDiscount, totalDiscount, currentSaleHandler } = cartStore;
//       const { paymentMethodsList, invoiceNote, invoiceString, physicalInvoiceNo, invoiceDate } = paymentStore;
//       const settings = authStore.softwareSettings as SoftwareSettings;

//       if (cartItemsList.length === 0) throw new Error('Cart is empty');
      
//       const customerId = authStore.currentUser?.customer_id || 1; // Default to 1 (Walk-in)
//       const shiftId = authStore.currentShift?.shift_id;
//       const storeId = authStore.currentStore?.store_id;

//       if (!shiftId) throw new Error('No active shift found');

//       const discountPolicy = settings.discount_policy;
//       const discountType = settings.discount_type;

//       // 1. Data Transformation (Flutter Logic Parity)
//       const productsPayload = cartItemsList.map((cartProd) => {
//         let totalCashAmount = totalAmountToPayWithoutDiscount;
//         let discount = 0;
//         let totalVal = 0;
//         let discountAmount = 0;
//         let discountedPrice = 0;

//         if (discountPolicy === 'overall') {
//           totalCashAmount += totalDiscount;
//           discount = (totalDiscount / totalCashAmount) * 100;
//           totalVal = cartProd.selling_price * cartProd.quantity;
//           discountAmount = (cartProd.selling_price * discount) / 100;
//           discountedPrice = totalVal - discountAmount;
//         } else if (discountPolicy === 'product-wise' || discountPolicy === 'discounted_price') {
//           totalCashAmount += cartProd.discount;
//           discount = (cartProd.discount / totalCashAmount) * 100;
//           totalVal = totalCashAmount * cartProd.quantity;
//           discountAmount = (totalCashAmount * discount) / 100;
//           discountedPrice = cartProd.discount === 0 ? totalCashAmount : totalCashAmount - cartProd.discount;
//         }

//         return {
//           product_id: cartProd.product_id,
//           name: cartProd.product_name,
//           full_name: cartProd.product_name,
//           barcode: cartProd.product.barcode,
//           has_variants: cartProd.product.has_variant,
//           child: cartProd.product.child,
//           head: cartProd.product.head,
//           sku: cartProd.product.sku,
//           selling_price: discountPolicy === 'overall' ? cartProd.selling_price : totalCashAmount,
//           whole_sale_price: cartProd.product.whole_sale_price,
//           product_discount: cartProd.product.discount,
//           discounted_price: totalVal,
//           discount: discount,
//           discount_amount: discountAmount,
//           qty: cartProd.quantity,
//           subtotal: totalVal,
//           available_qty: cartProd.product.count.total - cartProd.quantity,
//           total: Math.abs(discountedPrice),
//           enable_comments: 0,
//           comments: null,
//         };
//       });

//       // 2. Draft ID Handling
//       const draftId = currentSaleHandler === 'new-sale' ? "NaN" : currentSaleHandler;

//       // 3. Construct Payload
//       const paymentSale = {
//         customer: customerId,
//         shift_id: shiftId,
//         products: productsPayload,
//         payments: paymentMethodsList,
//         type: "payment_checkout",
//         receipt_type: identifier,
//         notes: invoiceNote,
//         sales: "sales",
//         sale_status: "Fulfilled",
//         pos_invoice: invoiceString,
//         draft_enabled: "0",
//         draft_id: draftId,
//         discount_type: discountType,
//         physical_invoice_no: physicalInvoiceNo,
//         date: invoiceDate,
//       };

//       const response = await axiosClient.post(`${authStore.baseURL}${API_ENDPOINTS.POS.PARTIAL_SALE}`, paymentSale, {
//         headers: { Authorization: `Bearer ${authStore.authToken}` }
//       });

//       if (response.status !== 200) throw new Error('Failed to make sale. Check your internet connection.');

//       // 4. Response Mapping (Ticket/Invoice Formats)
//       const responseData = response.data;
//       const result = responseData.result;
//       const saleData = result.sale[0];

//       if (identifier === 'ticket') {
//         return {
//           from: 'remote',
//           ticket: {
//             crtStoreName: authStore.currentStore?.store_name || '',
//             crtStoreCompleteAddress: `${authStore.currentStore?.store_street || ''}, ${authStore.currentStore?.store_city || ''}`,
//             crtStoreContact: authStore.currentStore?.phone_number || '',
//             date: saleData.created_at,
//             customerName: saleData.customer.name,
//             customerId: saleData.customer.customer_id.toString(),
//             saleId: saleData.sale_id.toString(),
//             userName: saleData.user.name,
//             salesmanName: saleData.salesman?.name || '',
//             ticketNo: saleData.ticket_no,
//             subtotal: saleData.actual_bill.toFixed(2),
//             totalTax: saleData.total_tax.toFixed(2),
//             totalBill: saleData.total_bill.toFixed(2),
//             totalDiscount: saleData.total_discount.toFixed(2),
//             amountPaid: saleData.amount_paid.toFixed(2),
//             balance: saleData.balance.toFixed(2),
//             saleItems: saleData.sale_items.map((si: any) => [
//               si.product.sku,
//               si.product.product_name,
//               si.qty.toString(),
//               si.actual_price.toFixed(2),
//               si.discount_amount.toFixed(2),
//               "0.00", // Default tax per Flutter logic if not complex
//               si.tax.toFixed(2),
//               si.subtotal.toFixed(2)
//             ]),
//           }
//         };
//       } else {
//         return {
//           from: 'remote',
//           invoice: {
//             saleData: saleData,
//             saleItemsData: saleData.sale_items,
//             salesmanData: saleData.salesman || {},
//             cashierData: saleData.user || {},
//             customerData: saleData.customer,
//             companyData: result.company,
//             settingsInvoiceFields: result.settings.invoice_fields,
//           }
//         };
//       }
//     },
//     onSuccess: () => {
//       // Clear cart and payment state on success
//       useCartStore.getState().clearCart();
//       usePaymentStore.getState().resetPaymentState();
//     }
//   });

//   return {
//     checkoutMutation,
//   };
// };
