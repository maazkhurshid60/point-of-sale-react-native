import { create } from 'zustand';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { useAuthStore } from './useAuthStore';
import { formatSaleResponseToSlipData } from '../utils/invoiceMapping';

export interface Sale {
  id: number;
  invoice_no: string;
  transaction_date: string;
  customer_name: string;
  final_total: string;
  payment_status: string;
  order_status?: string;
  [key: string]: any;
}

interface SalesState {
  sales: Sale[];
  isLoading: boolean;
  filters: {
    saleType: string;
    date: string | null;
    customerId: string | null;
    invoiceNo: string;
  };
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    total: number;
  };

  // Edit Sale State
  currentlySelectedSale: any | null;
  returnProductsList: any[];
  paymentsList: any[];
  totalBill: number;
  totalPaid: number;
  totalTax: number;
  totalDiscount: number;
  totalBalance: number;
  newAdjustment: number;
  notes: string;

  // Actions
  fetchSales: (page?: number) => Promise<void>;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  getSaleInvoice: (saleId: number, invoiceType?: string) => Promise<any>;

  // Edit Sale Actions
  fetchEditSaleForm: (saleId: number, originalSale: any) => Promise<void>;
  addReturnProduct: (item: any) => void;
  removeReturnProduct: (index: number) => void;
  updateReturnProduct: (index: number, key: string, value: any) => void;
  recalculateAmounts: () => void;
  makeReturnSale: (saleId: number) => Promise<boolean>;
  setCurrentlySelectedSale: (sale: any | null) => void;
  updateAdjustment: (amount: number) => void;
  searchProductBySku: (sku: string) => Promise<void>;

  // Payment Actions
  addPaymentMethod: (amount: number, method: string) => void;
  updatePayment: (index: number, key: string, value: any) => void;
  removePayment: (index: number) => void;
  setNotes: (notes: string) => void;
  resetEditSale: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  isLoading: false,
  filters: {
    saleType: 'sale',
    date: null,
    customerId: null,
    invoiceNo: '',
  },
  pagination: {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    total: 0,
  },

  currentlySelectedSale: null,
  returnProductsList: [],
  paymentsList: [],
  totalBill: 0,
  totalPaid: 0,
  totalTax: 0,
  totalDiscount: 0,
  totalBalance: 0,
  newAdjustment: 0,
  notes: '',

  setScreen: (screen: any) => {
    // This is handled by useUIStore but we might need to sync
  },

  setCurrentlySelectedSale: (sale) => set({ currentlySelectedSale: sale }),

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        saleType: 'sale',
        date: null,
        customerId: null,
        invoiceNo: '',
      }
    });
  },

  fetchSales: async (page = 1) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const currentShift = useAuthStore.getState().currentShift;

      const response = await axiosClient.get(API_ENDPOINTS.CATALOG.SALESLIST, {
        params: {
          page,
          sale_type: filters.saleType,
          shift_id: currentShift?.shift_id,
          date: filters.date,
          customer: filters.customerId,
          invoice: filters.invoiceNo,
        }
      });

      if (response.data) {
        const records = response.data.records || {};
        const data = records.data || [];
        set({
          sales: data,
          pagination: {
            currentPage: records.current_page || 1,
            hasNextPage: !!records.next_page_url,
            hasPrevPage: !!records.prev_page_url,
            total: records.total || 0,
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getSaleInvoice: async (saleId: number, invoiceType?: string) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.POS.GET_INVOICE, null, {
        params: { id: saleId, invoice_type: invoiceType || '' }
      });

      const res = response.data;
      if (res && (res.success || res.status === 'successfully' || res.status === 'success')) {
        const result = res.result;
        if (!result) return null;

        return formatSaleResponseToSlipData(result);
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      return null;
    }
  },

  fetchEditSaleForm: async (saleId: number, originalSale: any) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(API_ENDPOINTS.POS.EDIT_SALE_FORM, {
        params: { id: saleId }
      });

      if (response.data && response.data.success) {
        const saleData = response.data.sale;
        const saleItems = saleData.sale_items || [];

        const mappedItems = saleItems.map((item: any) => ({
          ...item,
          barcode: item.product?.barcode,
          sku: item.product?.sku,
          product_name: item.product?.product_name,
          actual_product: item.product,
          actual_price: item.actual_price || item.price,
        }));

        const actualSale = {
          ...saleData,
          name: originalSale.customer?.name || 'Walk-in Customer',
          invoice_no: saleData.invoice_no,
          sale_id: saleData.sale_id,
          sale_items: mappedItems,
          total_tax: saleData.total_tax,
          total_discount: saleData.total_discount,
          total_bill: saleData.total_bill,
          amount_paid: saleData.amount_paid,
          balance: saleData.balance,
          transactions: saleData.transactions || [],
          notes: saleData.notes || '',
        };

        set({
          currentlySelectedSale: actualSale,
          returnProductsList: [],
          paymentsList: [],
          newAdjustment: 0,
          notes: saleData.notes || '',
        });

        get().recalculateAmounts();
      }
    } catch (error) {
      console.error('Failed to fetch edit sale form:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addReturnProduct: (item) => {
    const { returnProductsList } = get();
    const copy = { ...item, qty: -1 };
    set({ returnProductsList: [...returnProductsList, copy] });
    get().recalculateAmounts();
  },

  removeReturnProduct: (index) => {
    const { returnProductsList } = get();
    const newList = [...returnProductsList];
    newList.splice(index, 1);
    set({ returnProductsList: newList });
    get().recalculateAmounts();
  },

  updateReturnProduct: (index, key, value) => {
    const { returnProductsList } = get();
    const newList = [...returnProductsList];
    newList[index] = { ...newList[index], [key]: value };
    set({ returnProductsList: newList });
    get().recalculateAmounts();
  },

  updateAdjustment: (amount) => {
    set({ newAdjustment: amount });
    get().recalculateAmounts();
  },

  recalculateAmounts: () => {
    const { currentlySelectedSale, returnProductsList, paymentsList, newAdjustment } = get();
    if (!currentlySelectedSale) return;

    let totalAmount = 0;
    let calculatedTax = 0;

    currentlySelectedSale.sale_items.forEach((item: any) => {
      totalAmount += Number(item.subtotal || 0);
    });

    returnProductsList.forEach((rItem: any) => {
      const product = Math.abs(rItem.qty || 0) * Math.abs(rItem.price || 0);
      if (rItem.qty > 0) {
        totalAmount += product;
      } else {
        totalAmount -= product;
      }
    });

    const originalTax = Number(currentlySelectedSale.total_tax || 0);
    const originalBillBeforeTax = Number(currentlySelectedSale.total_bill || 0) - originalTax;

    if (originalTax > 0 && originalBillBeforeTax > 0) {
      const taxRate = originalTax / originalBillBeforeTax;
      calculatedTax = totalAmount * taxRate;
    }

    const newTotalWithTax = totalAmount + calculatedTax;

    let additionalPayments = 0;
    paymentsList.forEach((p: any) => {
      additionalPayments += Number(p.amount || 0);
    });

    const amountPaid = Number(currentlySelectedSale.amount_paid || 0) + additionalPayments;
    const newBalance = newTotalWithTax - amountPaid - newAdjustment;

    set({
      totalTax: calculatedTax,
      totalDiscount: Number(currentlySelectedSale.total_discount || 0),
      totalBill: newTotalWithTax,
      totalPaid: amountPaid,
      totalBalance: newBalance,
    });
  },

  makeReturnSale: async (saleId: number) => {
    const { returnProductsList, paymentsList, currentlySelectedSale, totalBill, totalDiscount, notes, newAdjustment } = get();
    const authStore = useAuthStore.getState();
    const currentShift = authStore.currentShift;

    const discountPolicy = authStore.softwareSettings?.discount_policy || 'overall';
    let discount = 0;
    if (discountPolicy === 'overall') {
      const totalForDiscount = totalBill + totalDiscount;
      discount = (totalDiscount / totalForDiscount) * 100;
    }

    const products = returnProductsList.map((prod: any) => {
      const total = prod.price * prod.qty;
      return {
        product_id: prod.actual_product?.product_id,
        name: prod.actual_product?.product_name,
        full_name: prod.actual_product?.product_name,
        barcode: prod.actual_product?.barcode,
        sku: prod.actual_product?.sku,
        selling_price: prod.actual_product?.selling_price,
        qty: prod.qty,
        subtotal: prod.qty > 0 ? total : -Math.abs(total),
        discount: discount,
        discount_amount: prod.discount_amount || 0,
      };
    });

    const payments = paymentsList.map((p: any) => ({
      amount: p.amount,
      method: p.method,
      account_id: p.account_id,
      date: p.date,
    }));

    const payload = {
      sale_id: saleId,
      products: products,
      payments: payments,
      notes: notes,
      adjustment: newAdjustment,
      shift_id: currentShift?.shift_id,
    };

    try {
      const response = await axiosClient.post(API_ENDPOINTS.POS.UPDATE_SALE, payload);
      console.log("Payload of the update sale", payload);
      console.log("Response of the update sale", response.data);
      return response.data && response.data.success;
    } catch (error) {
      console.error('Failed to update sale:', error);
      return false;
    }
  },

  searchProductBySku: async (sku: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(API_ENDPOINTS.POS.PRODUCTS, {
        params: { search: sku }
      });

      if (response.data && response.data.success) {
        const products = response.data.records?.data || [];
        if (products.length > 0) {
          const product = products[0];
          get().addReturnProduct({
            id: Date.now(), // temporary id
            sku: product.sku,
            product_name: product.product_name,
            price: Number(product.selling_price),
            qty: 1,
            actual_product: product,
          });
        }
      }
    } catch (error) {
      console.error('Failed to search product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPaymentMethod: (amount: number, method: string) => {
    const { paymentsList } = get();
    const authStore = useAuthStore.getState();

    let accountId = null;
    if (method === 'Cash') {
      accountId = authStore.selectedCashAccountId;
    } else if (method === 'Bank' && authStore.bankAccounts.length > 0) {
      accountId = authStore.bankAccounts[0].id;
    }

    const newPayment = {
      id: Date.now(),
      amount,
      method,
      account_id: accountId,
      date: new Date().toISOString().split('T')[0],
      type: amount < 0 ? 'Refund' : 'Payment',
    };

    set({ paymentsList: [...paymentsList, newPayment] });
    get().recalculateAmounts();
  },

  updatePayment: (index, key, value) => {
    const { paymentsList } = get();
    const newList = [...paymentsList];
    newList[index] = { ...newList[index], [key]: value };
    set({ paymentsList: newList });
    get().recalculateAmounts();
  },

  removePayment: (index) => {
    const { paymentsList } = get();
    const newList = [...paymentsList];
    newList.splice(index, 1);
    set({ paymentsList: newList });
    get().recalculateAmounts();
  },

  setNotes: (notes) => set({ notes }),

  resetEditSale: () => {
    set({
      currentlySelectedSale: null,
      returnProductsList: [],
      paymentsList: [],
      totalBill: 0,
      totalPaid: 0,
      totalTax: 0,
      totalDiscount: 0,
      totalBalance: 0,
      newAdjustment: 0,
      notes: '',
    });
  }
}));
