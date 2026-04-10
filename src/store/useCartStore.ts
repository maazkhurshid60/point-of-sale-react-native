import { create } from "zustand";
import type { ProductModel, CartItemModel, HoldSaleModel } from "../models";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { useAuthStore } from "./useAuthStore";

interface CartState {
  cartItems: CartItemModel[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalToPay: number;
  currentSaleId: number | null; // null if new sale
  holdSales: HoldSaleModel[];
  nextPageUrl: string | null;

  // Actions
  addItem: (product: ProductModel) => void;
  removeItem: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyOverallDiscount: (amount: number) => void;
  clearCart: () => void;

  // Hold Sales Actions
  fetchHoldSales: (url?: string) => Promise<void>;
  holdCurrentSale: () => Promise<boolean>;
  recallSale: (saleId: number) => Promise<boolean>;
  deleteHoldSale: (saleId: number) => Promise<boolean>;
  makePrintBillSale: () => Promise<any>;

  // Internal logic
  recalculate: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  totalToPay: 0,
  currentSaleId: null,
  holdSales: [],
  nextPageUrl: null,

  addItem: (product: ProductModel) => {
    const { cartItems } = get();
    const existingItem = cartItems.find((item) => item.product_id === product.product_id);

    if (existingItem) {
      get().incrementQuantity(product.product_id);
    } else {
      const newItem: CartItemModel = {
        product_id: product.product_id,
        product_name: product.product_name,
        product: product,
        quantity: 1,
        selling_price: product.selling_price,
        discount: 0,
      };
      set({ cartItems: [...cartItems, newItem] });
      get().recalculate();
    }
  },

  removeItem: (productId: number) => {
    set({
      cartItems: get().cartItems.filter((item) => item.product_id !== productId),
    });
    get().recalculate();
  },

  incrementQuantity: (productId: number) => {
    set({
      cartItems: get().cartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    });
    get().recalculate();
  },

  decrementQuantity: (productId: number) => {
    const item = get().cartItems.find((i) => i.product_id === productId);
    if (item && item.quantity > 1) {
      set({
        cartItems: get().cartItems.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      });
    } else {
      get().removeItem(productId);
    }
    get().recalculate();
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
    } else {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        ),
      });
    }
    get().recalculate();
  },

  applyOverallDiscount: (amount: number) => {
    set({ discountAmount: amount });
    get().recalculate();
  },

  clearCart: () => {
    set({
      cartItems: [],
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalToPay: 0,
      currentSaleId: null,
    });
  },

  makePrintBillSale: async () => {
    const { cartItems, currentSaleId } = get();
    const auth = useAuthStore.getState();
    const shiftId = auth.currentShift?.shift_id;
    const customerId = 1; // Default customer if none selected

    if (cartItems.length === 0) return null;

    const products = cartItems.map(item => ({
      product_id: item.product_id,
      name: item.product_name,
      full_name: item.product_name,
      comments: null,
      enable_comments: 0,
      barcode: item.product?.barcode,
      sku: item.product?.sku,
      selling_price: item.selling_price,
      qty: item.quantity,
      subtotal: item.selling_price * item.quantity,
      total: item.selling_price * item.quantity,
      discount: item.discount || 0,
      discount_amount: 0, // Simplified for now
    }));

    const data = {
      shift_id: shiftId,
      customer_id: customerId,
      products: products,
      discount_type: 'amount',
      type: 'payment_checkout',
      draft_enabled: currentSaleId ? 1 : null,
      draft_id: currentSaleId
    };

    try {
      const res = await axiosClient.post(API_ENDPOINTS.POS.PRINT_BILL, data, {
        params: { invoice_type: 'invoice' }
      });
      if (res.data?.success) {
        const result = res.data.result;
        // Map to standard slip format
        return {
          saleData: result.sale,
          companyData: result.company,
          usersData: {
            sale_person: auth.currentUser?.name,
            customer_name: 'Walk-in-customer',
            customer_id: customerId
          },
          saleItemsData: result.sale?.sale_items || products,
          settingsInvoiceFields: result.settings?.invoice_fields,
          ...result
        };
      }
    } catch (e) {
      console.error("Failed to print bill", e);
    }
    return null;
  },

  fetchHoldSales: async (url) => {
    const storeId = useAuthStore.getState().currentStore?.store_id;
    const fetchUrl = url || `${API_ENDPOINTS.CATALOG.DRAFT_SALES_LIST}?page=1`;
    try {
      const res = await axiosClient.get(fetchUrl, {
        params: { store_id: storeId }
      });
      if (res.data?.success) {
        const draftData = res.data.draft;
        set({
          holdSales: url ? [...get().holdSales, ...draftData.data] : draftData.data,
          nextPageUrl: draftData.next_page_url
        });
      }
    } catch (e) {
      console.error("Failed to fetch hold sales", e);
    }
  },

  holdCurrentSale: async () => {
    const { cartItems, discountAmount, currentSaleId } = get();
    const auth = useAuthStore.getState();
    const shiftId = auth.currentShift?.shift_id;
    const customerId = 1; // Default customer if none selected

    if (cartItems.length === 0) return false;

    const products = cartItems.map(item => ({
      product_id: item.product_id,
      qty: item.quantity,
      price: item.selling_price,
      discount: item.discount || 0,
      total: item.selling_price * item.quantity
    }));

    const data = {
      shift_id: shiftId,
      customer_id: customerId,
      products: JSON.stringify(products),
      discount_type: 'amount', // default
      overall_discount: discountAmount,
      draft_enabled: 1,
      draft_id: currentSaleId
    };

    try {
      const res = await axiosClient.post(API_ENDPOINTS.POS.DRAFT_SALE, data);
      if (res.data?.success) {
        get().clearCart();
        return true;
      }
    } catch (e) {
      console.error("Failed to hold sale", e);
    }
    return false;
  },

  recallSale: async (saleId) => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.DRAFT_SALE_EDIT, {
        params: { draft: saleId }
      });
      if (res.data?.success) {
        const data = res.data.data;
        const draftSale = data.draftSale;
        const items = draftSale.sale_items;
        
        // Populate cart
        const newCartItems: CartItemModel[] = items.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product?.product_name || "Unknown Product",
          product: item.product,
          quantity: item.qty,
          selling_price: item.price,
          discount: item.discount || 0,
        }));

        set({
          cartItems: newCartItems,
          discountAmount: draftSale.total_discount,
          currentSaleId: saleId
        });
        get().recalculate();
        return true;
      }
    } catch (e) {
      console.error("Failed to recall sale", e);
    }
    return false;
  },

  deleteHoldSale: async (saleId) => {
    try {
      const res = await axiosClient.delete(API_ENDPOINTS.CATALOG.DRAFT_SALE_DELETE, {
        params: { sale_id: saleId }
      });
      if (res.data?.success) {
        set({
          holdSales: get().holdSales.filter(h => h.sale_id !== saleId)
        });
        return true;
      }
    } catch (e) {
      console.error("Failed to delete hold sale", e);
    }
    return false;
  },

  recalculate: () => {
    const { cartItems, discountAmount } = get();

    // 1. Calculate raw subtotal
    const newSubtotal = cartItems.reduce(
      (sum, item) => sum + item.selling_price * item.quantity,
      0
    );

    // 2. Calculate tax (placeholder for now: 0% or based on product if available)
    const currentTaxAmount = 0;

    // 3. Final Total
    const newTotal = newSubtotal - discountAmount + currentTaxAmount;

    set({
      subtotal: newSubtotal,
      taxAmount: currentTaxAmount,
      totalToPay: Math.max(0, newTotal),
    });
  },
}));
