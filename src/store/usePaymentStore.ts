import { create } from 'zustand';
import { PaymentMethod } from '../models';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { useAuthStore } from './useAuthStore';
import { useCartStore } from './useCartStore';

interface PaymentState {
  totalBill: number;
  totalPaid: number;
  totalBalance: number;
  physicalInvoiceNo: string;
  invoiceString: string;
  invoiceNote: string;
  invoiceDate: string;
  paymentMethodsList: PaymentMethod[];
  isPaidFieldEnabled: boolean;
  isCouponPartialSale: boolean;

  // Actions
  setPaymentScreenValues: (totalBill: number, totalBalance: number) => void;
  resetPaymentState: () => void;
  addPaymentMethod: (method: string, amount: number, accountId: number | null) => void;
  updatePaymentMethodAmount: (id: number, amount: number) => void;
  updatePaymentMethodAccount: (id: number, accountId: number) => void;
  updatePaymentMethodRef: (id: number, ref: string) => void;
  updatePaymentMethodDate: (id: number, date: string) => void;
  deletePaymentMethod: (id: number) => void;
  changePaidAmount: (amountStr: string, isFromPaidField: boolean) => void;
  setInvoiceMetadata: (metadata: Partial<{ physicalInvoiceNo: string; invoiceString: string; invoiceNote: string; invoiceDate: string }>) => void;
  setCouponPartialSale: (status: boolean) => void;
  validateCoupon: (paymentId: number, couponCode: string) => Promise<{ success: boolean; message: string; amount?: number }>;
  makePaymentSale: (type: string) => Promise<any>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  totalBill: 0,
  totalPaid: 0,
  totalBalance: 0,
  physicalInvoiceNo: '',
  invoiceString: '',
  invoiceNote: '',
  invoiceDate: new Date().toISOString(),
  paymentMethodsList: [],
  isPaidFieldEnabled: true,
  isCouponPartialSale: false,

  setPaymentScreenValues: (totalBill, totalBalance) => {
    set({
      totalBill,
      totalBalance,
      invoiceDate: new Date().toISOString(),
      paymentMethodsList: [],
      totalPaid: 0,
    });
  },

  resetPaymentState: () => {
    set({
      totalBill: 0,
      totalPaid: 0,
      totalBalance: 0,
      physicalInvoiceNo: '',
      invoiceString: '',
      invoiceNote: '',
      paymentMethodsList: [],
      isPaidFieldEnabled: true,
      isCouponPartialSale: false,
    });
  },

  addPaymentMethod: (method, amount, accountId) => {
    const { paymentMethodsList, totalBill } = get();
    const newMethod: PaymentMethod = {
      id: paymentMethodsList.length + 1, // Simple ID generation
      method,
      amount,
      account_id: accountId,
      type: amount >= 0 ? 'Payment' : 'Refund',
      ref: null,
      date: new Date().toISOString().split('T')[0],
    };

    const newList = [...paymentMethodsList, newMethod];
    const newTotalPaid = newList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    set({
      paymentMethodsList: newList,
      totalPaid: newTotalPaid,
      totalBalance: totalBill - newTotalPaid,
      isPaidFieldEnabled: false,
    });
  },

  updatePaymentMethodAmount: (id, amount) => {
    const { paymentMethodsList, totalBill } = get();
    const newList = paymentMethodsList.map((m) =>
      m.id === id ? { ...m, amount, type: amount >= 0 ? ('Payment' as const) : ('Refund' as const) } : m
    );
    const newTotalPaid = newList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    set({
      paymentMethodsList: newList,
      totalPaid: newTotalPaid,
      totalBalance: totalBill - newTotalPaid,
    });
  },

  updatePaymentMethodAccount: (id, accountId) => {
    const { paymentMethodsList } = get();
    const newList = paymentMethodsList.map((m) =>
      m.id === id ? { ...m, account_id: accountId } : m
    );
    set({ paymentMethodsList: newList });
  },

  updatePaymentMethodRef: (id, ref) => {
    const { paymentMethodsList } = get();
    const newList = paymentMethodsList.map((m) =>
      m.id === id ? { ...m, ref } : m
    );
    set({ paymentMethodsList: newList });
  },

  updatePaymentMethodDate: (id, date) => {
    const { paymentMethodsList } = get();
    const newList = paymentMethodsList.map((m) =>
      m.id === id ? { ...m, date } : m
    );
    set({ paymentMethodsList: newList });
  },

  deletePaymentMethod: (id) => {
    const { paymentMethodsList, totalBill } = get();
    const newList = paymentMethodsList.filter((m) => m.id !== id);
    const newTotalPaid = newList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    set({
      paymentMethodsList: newList,
      totalPaid: newTotalPaid,
      totalBalance: totalBill - newTotalPaid,
      isPaidFieldEnabled: newList.length === 0,
    });
  },

  changePaidAmount: (amountStr, isFromPaidField) => {
    const amount = parseFloat(amountStr) || 0;
    const { paymentMethodsList } = get();

    if (paymentMethodsList.length === 0) {
      get().addPaymentMethod('Cash', amount, null);
    } else if (paymentMethodsList.length === 1 && paymentMethodsList[0].method === 'Cash') {
      get().updatePaymentMethodAmount(paymentMethodsList[0].id, amount);
    } else if (isFromPaidField) {
      set({ paymentMethodsList: [] });
      get().addPaymentMethod('Cash', amount, null);
    }
  },

  setInvoiceMetadata: (metadata) => {
    set((state) => ({ ...state, ...metadata }));
  },

  setCouponPartialSale: (status) => {
    set({ isCouponPartialSale: status });
  },

  validateCoupon: async (paymentId, couponCode) => {
    if (!couponCode || couponCode.trim().length === 0) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.VALIDATE_COUPON, {
        params: { coupon_number: couponCode.trim() },
      });

      if (res.data?.status === true) {
        const couponAmountLeft = res.data.data?.coupon_amount_left || res.data.data?.coupon?.coupon_amount || 0;
        const { paymentMethodsList, totalBill } = get();

        // Auto-fill the coupon amount into the payment row
        const newList = paymentMethodsList.map((m) =>
          m.id === paymentId
            ? { ...m, amount: couponAmountLeft, ref: couponCode.trim() }
            : m
        );
        const newTotalPaid = newList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

        set({
          paymentMethodsList: newList,
          totalPaid: newTotalPaid,
          totalBalance: totalBill - newTotalPaid,
          isCouponPartialSale: true,
        });

        return {
          success: true,
          message: res.data?.message || 'Coupon validated!',
          amount: couponAmountLeft,
        };
      } else {
        return { success: false, message: res.data?.message || 'Invalid coupon.' };
      }
    } catch (e: any) {
      const errMsg = e.response?.data?.message || e.message || 'Failed to validate coupon.';
      console.error('[validateCoupon] Error:', errMsg);
      return { success: false, message: errMsg };
    }
  },

  makePaymentSale: async (type: string) => {
    const authStore = useAuthStore.getState();
    const cartStore = useCartStore.getState();

    const shiftId = authStore.currentShift?.shift_id;
    const storeId = authStore.currentStore?.store_id;
    const customerId = cartStore.selectedCustomerId;
    const customerName = cartStore.selectedCustomer;

    const {
      totalPaid,
      paymentMethodsList,
      invoiceNote,
      physicalInvoiceNo,
      invoiceDate
    } = get();

    if (cartStore.cartItems.length === 0) {
      console.warn('[makePaymentSale] Cart is empty.');
      return null;
    }

    // Walk-in customer check for invoice/bill type
    const isWalkIn = !customerId || customerId === 1 || (customerName || '').toLowerCase().includes('walk');
    if (type === 'print-bill' && isWalkIn) {
      console.warn('[makePaymentSale] Credit sale blocked for walk-in customer');
      return { error: 'walk-in', message: 'Credit Sale not allowed for Walk-in customer. Please select a customer first.' };
    }

    // Default cash ID fallback
    const fallbackAccountId = authStore.selectedCashAccount?.id || authStore.selectedCashAccountId || 0;
    const bankAccountId = authStore.selectedBankAccount?.id || authStore.selectedBankAccountId || 0;

    const products = cartStore.cartItems.map((item) => ({
      product_id: item.product_id,
      name: item.product_name,
      full_name: item.product_name,
      qty: item.quantity,
      selling_price: item.selling_price,
      price: item.selling_price,
      discount: item.discount || 0,
      discount_amount: item.discount || 0,
      total: item.selling_price * item.quantity,
      subtotal: item.selling_price * item.quantity,
      comments: 'N/A',
      enable_comments: 0,
      note: '',
      notes: '',
      serial_number: '',
      expiry_date: null,
      warehouse_id: null,
      tax: 0,
      tax_amount: 0,
      tax_rate: 0,
    }));

    // Transform paymentMethodsList for backend
    const formattedPayments = paymentMethodsList.map(pm => {
      let methodId = 1;
      if (pm.method.toLowerCase() === 'bank') methodId = 2;
      if (pm.method.toLowerCase() === 'card') methodId = 3;

      return {
        account_id: pm.account_id || fallbackAccountId,
        amount: pm.amount,
        method: pm.method.toLowerCase(),
        method_id: methodId
      };
    });

    const data = {
      shift_id: shiftId,
      store_id: storeId,
      customer_id: customerId,
      products: products,
      discount_type: authStore.softwareSettings?.discount_type || 'amount',
      discount_policy: authStore.softwareSettings?.discount_policy || 'overall',
      overall_discount: cartStore.discountAmount,
      total_discount: cartStore.discountAmount,
      discount_amount: cartStore.discountAmount,
      type: 'payment_checkout',
      draft_enabled: cartStore.currentSaleId ? 1 : null,
      draft_id: cartStore.currentSaleId,

      // Shotgun approach for account IDs — backend checks many different key names
      account_id: formattedPayments.length > 0 ? formattedPayments[0].account_id : fallbackAccountId,
      casher_account_id: fallbackAccountId,
      default_cash_account: fallbackAccountId,
      cash_account_id: fallbackAccountId,
      cash_account: fallbackAccountId,
      cash_id: fallbackAccountId,
      cashier_account: fallbackAccountId,
      casher_account: fallbackAccountId,
      casher_id: fallbackAccountId,
      cashier_id: fallbackAccountId,
      shift_cash_account_id: fallbackAccountId,
      payment_account_id: fallbackAccountId,
      payment_method_id: formattedPayments.length > 0 ? formattedPayments[0].method_id : 1,
      payment_type: formattedPayments.length > 0 ? formattedPayments[0].method : 'cash',

      bank_account_id: bankAccountId,
      default_bank_account: bankAccountId,
      bank_id: bankAccountId,

      payments: formattedPayments,

      paid_in: totalPaid,
      paying_amount: totalPaid,
      status: 'final',

      comments: invoiceNote,
      note: invoiceNote,
      notes: invoiceNote,
      physical_invoice_no: physicalInvoiceNo,
      sales_invoice_date: invoiceDate,
    };

    console.log(`[makePaymentSale] === FULL PAYLOAD ===`);
    console.log(`[makePaymentSale] type: ${type}`);
    console.log(`[makePaymentSale] shiftId: ${shiftId}, storeId: ${storeId}, customerId: ${customerId}`);
    console.log(`[makePaymentSale] fallbackAccountId: ${fallbackAccountId}, bankAccountId: ${bankAccountId}`);
    console.log(`[makePaymentSale] payments:`, JSON.stringify(formattedPayments));
    console.log(`[makePaymentSale] data:`, JSON.stringify(data));

    try {
      let endpoint = API_ENDPOINTS.POS.CHECKOUT;

      if (type === 'print-quotation') {
        endpoint = API_ENDPOINTS.POS.QUOTATION;
      } else if (type === 'print-bill') {
        endpoint = API_ENDPOINTS.POS.PRINT_BILL;
      }

      console.log(`[makePaymentSale] Posting to: ${endpoint}`);

      const res = await axiosClient.post(endpoint, data, {
        params: {
          invoice_type: type,
          account_id: fallbackAccountId,
          cash_account_id: fallbackAccountId,
          default_cash_account: fallbackAccountId,
        }
      });

      console.log(`[makePaymentSale] === RESPONSE ===`);
      console.log(`[makePaymentSale] status: ${res.status}`);
      console.log(`[makePaymentSale] data:`, JSON.stringify(res.data));

      if (res.data?.success || res.data?.status === 'success' || res.data?.status === 'successfully') {
        const result = res.data.result || res.data.data;
        cartStore.clearCart();
        get().resetPaymentState();
        return result;
      } else {
        console.warn(`[makePaymentSale] Non-success response:`, JSON.stringify(res.data));
      }
    } catch (e: any) {
      console.error(`[makePaymentSale] === ERROR ===`);
      console.error(`[makePaymentSale] Status:`, e.response?.status);
      console.error(`[makePaymentSale] Response data:`, JSON.stringify(e.response?.data));
      console.error(`[makePaymentSale] Headers:`, JSON.stringify(e.response?.headers));
      console.error(`[makePaymentSale] Message:`, e.message);
    }
    return null;
  },
}));
