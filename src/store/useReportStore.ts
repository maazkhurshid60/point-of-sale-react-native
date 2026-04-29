import { create } from 'zustand';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { useShiftStore } from './useShiftStore';

export type ReportType = 
  | 'PRODUCT' 
  | 'INVOICE' 
  | 'CASHIER' 
  | 'CREDIT_SALE' 
  | 'WAREHOUSE' 
  | 'STORE' 
  | 'DAILY_CASH';

export interface ReportFilterState {
  isChartsOpen: boolean;
  isSummaryOpen: boolean;
  selectedStoreAndBranch: string;
  selectedCategory: string;
  selectedProduct: string;
  selectedCustomer: string;
  selectedSalesman: string;
  selectedCustomerPostalCode: string;
  selectedSalePaymentStatus: string;
  isFiltersExpandedForMobile: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

const initialFilterState: ReportFilterState = {
  isChartsOpen: true,
  isSummaryOpen: false,
  selectedStoreAndBranch: 'default',
  selectedCategory: 'default',
  selectedProduct: 'default',
  selectedCustomer: 'default',
  selectedSalesman: 'default',
  selectedCustomerPostalCode: 'default',
  selectedSalePaymentStatus: 'default',
  isFiltersExpandedForMobile: false,
  startDate: new Date(),
  endDate: new Date(),
};

interface ReportState {
  // Keyed state for each report type to prevent overlap
  reports: Record<ReportType, ReportFilterState>;
  
  // Data for each report
  reportData: Record<ReportType, any>;
  isLoading: Record<ReportType, boolean>;

  // Mock data lists for parity with Flutter ReportsController
  listOfStoreAndBranches: string[];
  listOfSalesmen: string[];
  listOfCustomers: string[];
  listOfCategories: string[];
  listOfProducts: string[];
  listOfCustomerPostalCodes: string[];
  listOfPaymentStatuses: string[];

  // Actions
  updateFilter: (type: ReportType, field: keyof ReportFilterState, value: any) => void;
  toggleTabs: (type: ReportType, chartsOpen: boolean, summaryOpen: boolean) => void;
  toggleFiltersMobile: (type: ReportType) => void;
  resetFilters: (type: ReportType) => void;
  fetchReportData: (type: ReportType) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: {
    PRODUCT: { ...initialFilterState },
    INVOICE: { ...initialFilterState },
    CASHIER: { ...initialFilterState },
    CREDIT_SALE: { ...initialFilterState },
    WAREHOUSE: { ...initialFilterState },
    STORE: { ...initialFilterState },
    DAILY_CASH: { ...initialFilterState },
  },

  reportData: {
    PRODUCT: null,
    INVOICE: null,
    CASHIER: null,
    CREDIT_SALE: null,
    WAREHOUSE: null,
    STORE: null,
    DAILY_CASH: null,
  },

  isLoading: {
    PRODUCT: false,
    INVOICE: false,
    CASHIER: false,
    CREDIT_SALE: false,
    WAREHOUSE: false,
    STORE: false,
    DAILY_CASH: false,
  },

  // Mock data lists for parity with Flutter ReportsController
  listOfStoreAndBranches: [
    'default',
    'Al-Asif Hardware',
    'Saleem Electronics',
    'food Street Rawalpindi',
  ],
  listOfSalesmen: ['default', 'Naveed', 'Ahmed', 'Akmal'],
  listOfCustomers: ['default', 'Azaz', 'Dainial', 'Akmal'],
  listOfCategories: ['default', 'Medical', 'Hardware', 'Eletronics'],
  listOfProducts: ['default', 'Infinix', 'Bolt42', 'panadol'],
  listOfCustomerPostalCodes: ['default', '44000', '41000', '4500'],
  listOfPaymentStatuses: ['default', 'partial', 'fulfill', 'pending'],

  updateFilter: (type, field, value) => {
    set((state) => ({
      reports: {
        ...state.reports,
        [type]: {
          ...state.reports[type],
          [field]: value,
        },
      },
    }));
  },

  toggleTabs: (type, chartsOpen, summaryOpen) => {
    set((state) => ({
      reports: {
        ...state.reports,
        [type]: {
          ...state.reports[type],
          isChartsOpen: chartsOpen,
          isSummaryOpen: summaryOpen,
        },
      },
    }));
  },

  toggleFiltersMobile: (type) => {
    set((state) => ({
      reports: {
        ...state.reports,
        [type]: {
          ...state.reports[type],
          isFiltersExpandedForMobile: !state.reports[type].isFiltersExpandedForMobile,
        },
      },
    }));
  },

  resetFilters: (type) => {
    set((state) => ({
      reports: {
        ...state.reports,
        [type]: { ...initialFilterState },
      },
    }));
  },

  fetchReportData: async (type) => {
    const shiftId = useShiftStore.getState().currentShift?.shift_id;
    if (!shiftId) return;

    set((state) => ({ isLoading: { ...state.isLoading, [type]: true } }));

    let endpoint = '';
    switch (type) {
      case 'PRODUCT': endpoint = API_ENDPOINTS.SHIFT.PRODUCT_REPORT; break;
      case 'INVOICE': endpoint = API_ENDPOINTS.SHIFT.INVOICE_REPORT; break;
      case 'CASHIER': endpoint = API_ENDPOINTS.SHIFT.CASHIER_REPORT; break;
      case 'CREDIT_SALE': endpoint = API_ENDPOINTS.SHIFT.CREDIT_SALE_REPORT; break;
      case 'WAREHOUSE': endpoint = API_ENDPOINTS.SHIFT.WAREHOUSE_REPORT; break;
      case 'STORE': endpoint = API_ENDPOINTS.SHIFT.STORE_REPORT; break;
      case 'DAILY_CASH': endpoint = API_ENDPOINTS.SHIFT.DAILY_REPORTS; break;
    }

    try {
      const filters = get().reports[type];
      const res = await axiosClient.get(endpoint, {
        params: {
          shift_id: shiftId,
          store_id: filters.selectedStoreAndBranch !== 'default' ? filters.selectedStoreAndBranch : undefined,
          category_id: filters.selectedCategory !== 'default' ? filters.selectedCategory : undefined,
          // Add other filter params as needed by the backend
        }
      });

      if (res.data?.success) {
        set((state) => ({
          reportData: { ...state.reportData, [type]: res.data },
          isLoading: { ...state.isLoading, [type]: false }
        }));
      } else {
        // If API fails or is not found, we keep current data or set dummy for now to avoid crashes
        set((state) => ({ isLoading: { ...state.isLoading, [type]: false } }));
      }
    } catch (e) {
      console.error(`Error fetching ${type} report:`, e);
      set((state) => ({ isLoading: { ...state.isLoading, [type]: false } }));
    }
  }
}));
