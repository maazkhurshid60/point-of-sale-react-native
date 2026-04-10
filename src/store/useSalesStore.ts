import { create } from 'zustand';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { useAuthStore } from './useAuthStore';

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

  // Actions
  fetchSales: (page?: number) => Promise<void>;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  getSaleInvoice: (saleId: number, invoiceType?: string) => Promise<any>;
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

        // Map API keys to BaseSlipData structure used in dialogs
        const saleData = Array.isArray(result.sale) ? result.sale[0] : (result.sale || result);
        const customerData = Array.isArray(result.customer) ? result.customer[0] : (result.customer || result.customer_data || saleData?.customer || result.saleData?.customer);
        const companyData = result.company || result.company_data || result.business || result.saleData?.business;
        
        // Items mapping
        const saleItemsData = result.sale_items || 
                             result.sale_details || 
                             result.products || 
                             result.items || 
                             saleData?.sale_items || 
                             saleData?.sale_details || 
                             [];

        // User/Cashier mapping
        const cashierData = result.cashier || 
                           result.cashier_name || 
                           saleData?.user || 
                           result.user || 
                           result.usersData?.sale_person;

        const salesmanData = result.salesman || 
                            result.sales_man || 
                            result.sale_person || 
                            result.salesPerson || 
                            saleData?.salesman || 
                            result.usersData?.salesman_name;

        return {
          saleData: saleData,
          companyData: companyData,
          customerData: customerData,
          salesmanData: salesmanData,
          cashierData: cashierData,
          saleItemsData: saleItemsData,
          usersData: {
            sale_person: cashierData?.name || cashierData || 'N/A',
            customer_name: customerData?.name || customerData?.first_name || 'Walk-in-customer',
            customer_id: customerData?.customer_id || customerData?.id,
            salesman_name: salesmanData?.name || salesmanData || '',
            ...result.usersData
          },
          settingsInvoiceFields: result.settings?.invoice_fields || result.settingsInvoiceFields,
          ...result
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      return null;
    }
  }
}));
