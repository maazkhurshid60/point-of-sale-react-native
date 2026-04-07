// import { create } from 'zustand';
// import { useAuthStore } from './useAuthStore';
// import { ProductModel, CartItemModel, TaxModel } from '../models';
// import { POS_PERMISSION_STRING } from '../constants/permissions';
// import { API_ENDPOINTS } from '../constants/apiEndpoints';

// interface CartState {
//   cartItemsList: CartItemModel[];
//   paying: number;
//   change: number;
//   totalDiscount: number;
//   appliedCouponAmount: number;
//   calculatedTaxAmount: number;
//   totalAmountToPay: number;
//   totalAmountToPayWithoutDiscount: number;
//   activeTaxesList: TaxModel[];
//   selectedCustomer: string;
//   selectedCustomerId: number | null;
  
//   // Parity Variables
//   currentSaleHandler: string;
//   isFromOfflineSale: boolean;
//   offlineSaleId: number | string | null;

//   // Actions
//   addProductToCart: (product: ProductModel) => void;
//   addProductByUPCIDBarcode: (keyword: string) => Promise<void>;
//   deleteProductFromCart: (product: ProductModel) => void;
//   incrementSingle: (product: ProductModel) => void;
//   decrementSingle: (product: ProductModel) => void;
//   bulkQtyIncrement: (quantity: string, product: ProductModel) => void;
//   applyDiscountOverallPolicy: (discount: string) => void;
//   applyDiscountOnASingleProductPrice: (cartItem: CartItemModel, discount: string) => void;
//   clearCart: () => void;
//   addTaxToActive: (tax: TaxModel) => void;
//   removeTaxFromActive: (tax: TaxModel) => void;
//   recalculateAmountAndTax: () => void;
//   changePayingAmount: (amount: string) => void;
//   changeProductName: (cartItem: CartItemModel, name: string) => void;
//   changeProductSellingPrice: (cartItem: CartItemModel, price: string) => void;
//   priceFromDiscountedPrice: (cartItem: CartItemModel, price: string) => void;
  
//   // Parity Helpers
//   checkIfTaxIsPresent: (tax: TaxModel) => boolean;
//   setSaleType: (type: string, id?: number | string | null) => void;
//   setSelectedCustomer: (customerName: string, customerId: number | null) => void;
//   setAppliedCoupon: (amount: number) => void;
// }

// export const useCartStore = create<CartState>((set, get) => ({
//   cartItemsList: [],
//   paying: 0,
//   change: 0,
//   totalDiscount: 0,
//   appliedCouponAmount: 0,
//   calculatedTaxAmount: 0,
//   totalAmountToPay: 0,
//   totalAmountToPayWithoutDiscount: 0,
//   activeTaxesList: [],
//   selectedCustomer: 'Walk-In-Customer',
//   selectedCustomerId: null,
  
//   currentSaleHandler: 'new-sale',
//   isFromOfflineSale: false,
//   offlineSaleId: null,

//   recalculateAmountAndTax: () => {
//     const { cartItemsList, totalDiscount, activeTaxesList, appliedCouponAmount } = get();
//     let totalAmount = 0;
//     let totalTaxPercentage = 0;

//     // 1. Calculate subtotal
//     cartItemsList.forEach((item) => {
//       totalAmount += item.selling_price * item.quantity;
//     });

//     // 2. Apply overall discount and coupon
//     if (cartItemsList.length > 0) {
//       totalAmount -= (totalDiscount + appliedCouponAmount);
//     }

//     // 3. Sum up tax percentages
//     activeTaxesList.forEach((tax) => {
//       totalTaxPercentage += tax.tax;
//     });

//     // 4. Calculate tax amount (precision 2)
//     const totalAppliedTaxAmount = (totalAmount * totalTaxPercentage) / 100;
//     const taxAmountApplied = parseFloat(totalAppliedTaxAmount.toFixed(2));
    
//     // 5. Final total
//     const finalTotal = totalAmount + taxAmountApplied;

//     set({
//       totalAmountToPay: finalTotal,
//       change: finalTotal, // Replicates Flutter's change.value = totalAmount
//       totalAmountToPayWithoutDiscount: finalTotal,
//       calculatedTaxAmount: taxAmountApplied,
//     });
//   },

//   setAppliedCoupon: (amount: number) => {
//     set({ appliedCouponAmount: amount });
//     get().recalculateAmountAndTax();
//   },

//   addProductToCart: (product: ProductModel) => {
//     const { cartItemsList, recalculateAmountAndTax } = get();
//     const authStore = useAuthStore.getState();
//     const outOfStockPermission = authStore.checkIfPermissionIsGranted(POS_PERMISSION_STRING.PERMISSION_OUT_OF_STOCK);

//     const existingItem = cartItemsList.find((item) => item.product_id === product.product_id);

//     if (existingItem) {
//       if (!outOfStockPermission) {
//         if (existingItem.quantity === -1) {
//           throw new Error('Stock exceeds. Unable to add more product. Can only be used for return.');
//         } else {
//           const totalQty = product.count.total;
//           const newQty = existingItem.quantity + 1;
//           if (totalQty - newQty < 0) {
//             throw new Error('Stock exceeds. Unable to add more product. Can only be used for return.');
//           }
//         }
//       }

//       set((state) => ({
//         cartItemsList: state.cartItemsList.map((item) =>
//           item.product_id === product.product_id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         ),
//       }));
//       recalculateAmountAndTax();
//     } else {
//       const isOutOfStock = product.count.total <= 0;
//       const initialQty = outOfStockPermission ? 1 : !isOutOfStock ? 1 : -1;

//       const newItem: CartItemModel = {
//         product_id: product.product_id,
//         product_name: product.product_name,
//         product: product,
//         quantity: initialQty,
//         selling_price: product.selling_price,
//         discount: 0,
//       };

//       set((state) => ({
//         cartItemsList: [...state.cartItemsList, newItem],
//       }));
//       recalculateAmountAndTax();
//     }
//   },

//   addProductByUPCIDBarcode: async (keyword: string) => {
//     if (!keyword) return;

//     const baseURL = useAuthStore.getState().baseURL;
//     const token = useAuthStore.getState().authToken;

//     const { default: axiosClient } = await import('../api/axiosClient');

//     const response = await axiosClient.get(`${baseURL}${API_ENDPOINTS.CATALOG.PRODUCTS_POS}`, {
//       params: { keyword },
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.data?.success && response.data?.data?.Products?.length > 0) {
//       const product = response.data.data.Products[0] as ProductModel;
//       get().addProductToCart(product);
//     } else {
//       throw new Error('Product not found');
//     }
//   },

//   deleteProductFromCart: (product: ProductModel) => {
//     set((state) => ({
//       cartItemsList: state.cartItemsList.filter((item) => item.product_id !== product.product_id),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   incrementSingle: (product: ProductModel) => {
//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) =>
//         item.product_id === product.product_id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   decrementSingle: (product: ProductModel) => {
//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) =>
//         item.product_id === product.product_id
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       ),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   bulkQtyIncrement: (quantity: string, product: ProductModel) => {
//     const qty = parseFloat(quantity);
//     if (isNaN(qty)) throw new Error('Please use numbers only');

//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) =>
//         item.product_id === product.product_id
//           ? { ...item, quantity: qty }
//           : item
//       ),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   applyDiscountOverallPolicy: (discount: string) => {
//     const authStore = useAuthStore.getState();
//     const discountType = authStore.softwareSettings?.discount_type || 'amount';
//     let discountValue = parseFloat(discount) || 0;

//     if (discountType === 'percentage') {
//       const subtotal = get().cartItemsList.reduce((acc, item) => acc + item.selling_price * item.quantity, 0);
//       discountValue = parseFloat(((subtotal * discountValue) / 100).toFixed(1));
//     }

//     set({ totalDiscount: discountValue });
//     get().recalculateAmountAndTax();
//   },

//   applyDiscountOnASingleProductPrice: (cartItem: CartItemModel, discount: string) => {
//     const authStore = useAuthStore.getState();
//     const discountType = authStore.softwareSettings?.discount_type || 'amount';
//     const discountValue = parseFloat(discount) || 0;

//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) => {
//         if (item.product_id === cartItem.product_id) {
//           let appliedDiscount = discountValue;
//           if (discountType === 'percentage') {
//             appliedDiscount = (item.product.selling_price * discountValue) / 100;
//           }
//           const newPrice = item.product.selling_price - appliedDiscount;
//           return { ...item, discount: appliedDiscount, selling_price: newPrice };
//         }
//         return item;
//       }),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   changePayingAmount: (amount: string) => {
//     const amountVal = parseFloat(amount) || 0;
//     const { totalAmountToPay } = get();
//     set({
//       paying: amountVal,
//       change: totalAmountToPay - amountVal,
//     });
//   },

//   clearCart: () => {
//     set({
//       cartItemsList: [],
//       paying: 0,
//       change: 0,
//       totalDiscount: 0,
//       appliedCouponAmount: 0,
//       calculatedTaxAmount: 0,
//       totalAmountToPay: 0,
//       totalAmountToPayWithoutDiscount: 0,
//     });
//   },

//   addTaxToActive: (tax: TaxModel) => {
//     set((state) => ({
//       activeTaxesList: [...state.activeTaxesList, tax],
//     }));
//     get().recalculateAmountAndTax();
//   },

//   removeTaxFromActive: (tax: TaxModel) => {
//     set((state) => ({
//       activeTaxesList: state.activeTaxesList.filter((item) => item.tax_id !== tax.tax_id),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   changeProductName: (cartItem: CartItemModel, name: string) => {
//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) =>
//         item.product_id === cartItem.product_id
//           ? { ...item, product_name: name || item.product.product_name }
//           : item
//       ),
//     }));
//   },

//   changeProductSellingPrice: (cartItem: CartItemModel, price: string) => {
//     const newPrice = parseFloat(price);
//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) =>
//         item.product_id === cartItem.product_id
//           ? { ...item, selling_price: isNaN(newPrice) ? item.product.selling_price : newPrice }
//           : item
//       ),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   priceFromDiscountedPrice: (cartItem: CartItemModel, price: string) => {
//     const discountedPriceValue = parseFloat(price);
//     set((state) => ({
//       cartItemsList: state.cartItemsList.map((item) => {
//         if (item.product_id === cartItem.product_id) {
//           if (isNaN(discountedPriceValue)) {
//             return { ...item, selling_price: item.product.selling_price, discount: 0 };
//           }
//           const originalPrice = item.product.selling_price;
//           return { ...item, selling_price: discountedPriceValue, discount: originalPrice - discountedPriceValue };
//         }
//         return item;
//       }),
//     }));
//     get().recalculateAmountAndTax();
//   },

//   checkIfTaxIsPresent: (tax: TaxModel) => {
//     return get().activeTaxesList.some((t) => t.tax_id === tax.tax_id);
//   },

//   setSaleType: (type, id = null) => {
//     set({
//       currentSaleHandler: type,
//       isFromOfflineSale: type === 'offline',
//       offlineSaleId: id
//     });
//   },

//   setSelectedCustomer: (customerName, customerId) => {
//     set({
//       selectedCustomer: customerName,
//       selectedCustomerId: customerId
//     });
//   }
// }));
