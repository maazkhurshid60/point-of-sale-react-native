import { create } from "zustand";
import type { ProductModel, CartItemModel, HoldSaleModel } from "../models";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { useShiftStore } from "./useShiftStore";
import { useAccountStore } from "./useAccountStore";
import { useSettingsStore } from "./useSettingsStore";
import { createAudioPlayer } from "expo-audio";
import { Logger } from '../utils/logger';

const cartAddItemPlayer = createAudioPlayer(require('../../assets/beep.wav'));

const playAddToCartSound = () => {
  try {
    cartAddItemPlayer.seekTo(0);
    cartAddItemPlayer.play();
  } catch (error) {
    console.log('Error playing sound', error);
  }
};

interface CartState {
  cartItems: CartItemModel[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalToPay: number;
  currentSaleId: number | null; // null if new sale
  holdSales: HoldSaleModel[];
  nextPageUrl: string | null;
  selectedCustomer: string;
  selectedCustomerId: number;

  // Actions
  addItem: (product: ProductModel) => void;
  removeItem: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  bulkQtyIncrement: (quantity: string | number, product: ProductModel) => void;
  applyDiscountOnASingleProductPrice: (cartItem: CartItemModel, discount: string | number) => void;
  applyOverallDiscount: (amount: number) => void;
  clearCart: () => void;
  setSelectedCustomer: (name: string, id: number) => void;

  // Hold Sales Actions
  fetchHoldSales: (url?: string) => Promise<void>;
  holdCurrentSale: () => Promise<boolean>;
  recallSale: (saleId: number) => Promise<boolean>;
  deleteHoldSale: (saleId: number) => Promise<boolean>;
  makeSale: (type: string) => Promise<any>;

  // Internal logic
  recalculate: () => void;
  addProductByUPCIDBarcode: (keyword: string) => Promise<void>;
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
  selectedCustomer: 'Walk-in-customer',
  selectedCustomerId: 1,

  addItem: (product: ProductModel) => {
    playAddToCartSound();
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

  bulkQtyIncrement: (quantity: string | number, product: ProductModel) => {
    playAddToCartSound();
    const numQty = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    if (isNaN(numQty) || numQty <= 0) return;

    const { cartItems } = get();
    const existingItem = cartItems.find((item) => item.product_id === product.product_id);

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + numQty }
            : item
        ),
      });
    } else {
      const newItem: CartItemModel = {
        product_id: product.product_id,
        product_name: product.product_name,
        product: product,
        quantity: numQty,
        selling_price: product.selling_price,
        discount: 0,
      };
      set({ cartItems: [...cartItems, newItem] });
    }
    get().recalculate();
  },

  applyDiscountOnASingleProductPrice: (cartItem: CartItemModel, discount: string | number) => {
    const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;
    if (isNaN(numDiscount)) return;

    set({
      cartItems: get().cartItems.map((item) =>
        item.product_id === cartItem.product_id ? { ...item, discount: numDiscount } : item
      ),
    });
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
      selectedCustomer: 'Walk-in-customer',
      selectedCustomerId: 1,
    });
  },

  setSelectedCustomer: (name: string, id: number) => {
    set({ selectedCustomer: name, selectedCustomerId: id });
  },

  makeSale: async (type: string) => {
    const { cartItems, currentSaleId, discountAmount, selectedCustomerId } = get();
    const shiftStore = useShiftStore.getState();
    const accountStore = useAccountStore.getState();
    const settingsStore = useSettingsStore.getState();
    const shiftId = shiftStore.currentShift?.shift_id;
    const storeId = shiftStore.currentStore?.store_id;

    if (cartItems.length === 0) return null;

    const products = cartItems.map(item => ({
      product_id: item.product_id,
      name: item.product_name,
      full_name: item.product_name,
      qty: item.quantity,
      selling_price: item.selling_price,
      price: item.selling_price,
      discount: item.discount || 0,
      discount_amount: item.discount || 0,  // Backend foreach line 95
      total: item.selling_price * item.quantity,
      subtotal: item.selling_price * item.quantity,
      comments: 'N/A',          // Backend foreach line 189
      enable_comments: 0,        // Backend foreach line 190
      note: '',
      notes: '',
      serial_number: '',
      expiry_date: null,
      warehouse_id: null,
      tax: 0,
      tax_amount: 0,
      tax_rate: 0,
    }));

    const cashId = accountStore.selectedCashAccount?.id || accountStore.selectedCashAccountId || 0;
    const bankId = accountStore.selectedBankAccount?.id || accountStore.selectedBankAccountId || 0;

    const data = {
      shift_id: shiftId,
      store_id: storeId,
      customer_id: selectedCustomerId,
      products: products,
      discount_type: settingsStore.softwareSettings?.discount_type || 'amount',
      discount_policy: settingsStore.softwareSettings?.discount_policy || 'overall', // Added
      overall_discount: discountAmount,
      total_discount: discountAmount,   // Some endpoints use total_discount
      discount_amount: discountAmount,  // DataController.php line 95 expects this key
      type: 'payment_checkout',
      draft_enabled: currentSaleId ? 1 : null,
      draft_id: currentSaleId,

      // Shotgun approach for account IDs to satisfy different controller requirements
      account_id: cashId,
      casher_account_id: cashId,
      default_cash_account: cashId,
      cash_account_id: cashId,
      cash_account: cashId,
      cash_id: cashId,
      cashier_account: cashId, // Added correct spelling
      casher_account: cashId,
      casher_id: cashId,       // Added
      cashier_id: cashId,      // Added
      shift_cash_account_id: cashId, // Added
      payment_account_id: cashId,
      payment_method_id: 1,    // Added common default for Cash
      payment_type: 'cash',

      bank_account_id: bankId,
      default_bank_account: bankId,
      bank_id: bankId,

      // Often required: A structured payments array
      payments: [{
        account_id: cashId,
        amount: get().totalToPay,
        method: 'cash',
        method_id: 1
      }],

      // Additional fields often required for 403 prevention
      paid_in: get().totalToPay,
      paying_amount: get().totalToPay,
      status: 'final',

      // Notes/comments field — backend reads $request['comments'] at line 189
      comments: '',
      note: '',
      notes: '',
    };

    Logger.debugPayload(`makeSale Attempting ${type} sale with expanded payload`, data);

    try {
      let endpoint = API_ENDPOINTS.POS.CHECKOUT;
      let method = 'POST';

      if (type === 'print-quotation') {
        endpoint = API_ENDPOINTS.POS.QUOTATION;
      } else if (type === 'print-bill') {
        endpoint = API_ENDPOINTS.POS.PRINT_BILL;
      } else if (type === 'print-sample') {
        endpoint = API_ENDPOINTS.POS.SAMPLE_SALE;
      }

      const res = await axiosClient.post(endpoint, data, {
        params: {
          invoice_type: type,
          // Duplicate account IDs in params just in case backend checks query strings
          account_id: cashId,
          cash_account_id: cashId,
          default_cash_account: cashId
        }
      });

      Logger.debugPayload(`makeSale API Response for ${type}`, res.data);

      if (res.data?.success || res.data?.status === 'success' || res.data?.status === 'successfully') {
        const result = res.data.result || res.data.data;
        get().clearCart();
        return result;
      } else {
        console.warn(`[makeSale] Server returned non-success for ${type}:`, res.data?.message || 'Unknown error');
      }
    } catch (e: any) {
      console.error(`[makeSale] Failed to make ${type} sale. Error:`, e.response?.data || e.message);
    }
    return null;
  },

  fetchHoldSales: async (url) => {
    const storeId = useShiftStore.getState().currentStore?.store_id;
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
    const shiftId = useShiftStore.getState().currentShift?.shift_id;
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
      products: products,
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

  addProductByUPCIDBarcode: async (keyword: string) => {
    if (!keyword) return;

    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.PRODUCTS_POS, {
        params: { keyword }
      });

      if (res.data?.success || res.data?.data?.success) {
        const productList = res.data.data?.Products || res.data.Products || [];
        if (productList.length === 0) {
          throw new Error('Product not found');
        }

        const product = productList[0] as ProductModel;
        get().addItem(product);
      } else {
        throw new Error('Failed to find product');
      }
    } catch (e: any) {
      console.error("Failed to add product by barcode/SKU", e);
      throw e;
    }
  },
}));
