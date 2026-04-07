// import { create } from 'zustand';

// export type ReportType = 'GENERAL' | 'CASHIER' | 'WAREHOUSE' | 'CREDIT_SALE' | 'INVOICE_PAYMENT';

// export interface ReportFilterState {
//   isChartsOpen: boolean;
//   isSummaryOpen: boolean;
//   selectedStoreAndBranch: string;
//   selectedCategory: string;
//   selectedProduct: string;
//   selectedCustomer: string;
//   selectedSalesman: string;
//   selectedCustomerPostalCode: string;
//   selectedSalePaymentStatus: string;
//   isFiltersExpandedForMobile: boolean;
// }

// const initialFilterState: ReportFilterState = {
//   isChartsOpen: true,
//   isSummaryOpen: false,
//   selectedStoreAndBranch: 'default',
//   selectedCategory: 'default',
//   selectedProduct: 'default',
//   selectedCustomer: 'default',
//   selectedSalesman: 'default',
//   selectedCustomerPostalCode: 'default',
//   selectedSalePaymentStatus: 'default',
//   isFiltersExpandedForMobile: false,
// };

// interface ReportState {
//   // Keyed state for each report type to prevent overlap
//   reports: Record<ReportType, ReportFilterState>;
  
//   // Parity Lists (Hardcoded in Flutter project)
//   listOfStoreAndBranches: string[];
//   listOfSalesmen: string[];
//   listOfCustomers: string[];
//   listOfCategories: string[];
//   listOfProducts: string[];
//   listOfCustomerPostalCodes: string[];
//   listOfPaymentStatuses: string[];

//   // Actions
//   updateFilter: (type: ReportType, field: keyof ReportFilterState, value: any) => void;
//   toggleTabs: (type: ReportType, chartsOpen: boolean, summaryOpen: boolean) => void;
//   toggleFiltersMobile: (type: ReportType) => void;
//   resetFilters: (type: ReportType) => void;
// }

// export const useReportStore = create<ReportState>((set) => ({
//   reports: {
//     GENERAL: { ...initialFilterState },
//     CASHIER: { ...initialFilterState },
//     WAREHOUSE: { ...initialFilterState },
//     CREDIT_SALE: { ...initialFilterState },
//     INVOICE_PAYMENT: { ...initialFilterState },
//   },

//   // Mock data lists for parity with Flutter ReportsController
//   listOfStoreAndBranches: [
//     'default',
//     'Al-Asif Hardware',
//     'Saleem Electronics',
//     'food Street Rawalpindi',
//   ],
//   listOfSalesmen: ['default', 'Naveed', 'Ahmed', 'Akmal'],
//   listOfCustomers: ['default', 'Azaz', 'Dainial', 'Akmal'],
//   listOfCategories: ['default', 'Medical', 'Hardware', 'Eletronics'],
//   listOfProducts: ['default', 'Infinix', 'Bolt42', 'panadol'],
//   listOfCustomerPostalCodes: ['default', '44000', '41000', '4500'],
//   listOfPaymentStatuses: ['default', 'partial', 'fulfill', 'pending'],

//   updateFilter: (type, field, value) => {
//     set((state) => ({
//       reports: {
//         ...state.reports,
//         [type]: {
//           ...state.reports[type],
//           [field]: value,
//         },
//       },
//     }));
//   },

//   toggleTabs: (type, chartsOpen, summaryOpen) => {
//     set((state) => ({
//       reports: {
//         ...state.reports,
//         [type]: {
//           ...state.reports[type],
//           isChartsOpen: chartsOpen,
//           isSummaryOpen: summaryOpen,
//         },
//       },
//     }));
//   },

//   toggleFiltersMobile: (type) => {
//     set((state) => ({
//       reports: {
//         ...state.reports,
//         [type]: {
//           ...state.reports[type],
//           isFiltersExpandedForMobile: !state.reports[type].isFiltersExpandedForMobile,
//         },
//       },
//     }));
//   },

//   resetFilters: (type) => {
//     set((state) => ({
//       reports: {
//         ...state.reports,
//         [type]: { ...initialFilterState },
//       },
//     }));
//   }
// }));
