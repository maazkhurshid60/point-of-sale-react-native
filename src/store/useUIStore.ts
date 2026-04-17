import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppScreen =
  | 'DEFAULT'
  | 'SHIFT_DETAILS'
  | 'CUSTOMERS'
  | 'SALES'
  | 'EDIT_SALE'
  | 'PAYMENT'
  | 'DAILY_REPORT'
  | 'OFFLINE_SALES'
  | 'ORDER_VIEW'
  | 'EDIT_ORDER'
  | 'PROFILE'
  | 'POS_SETTINGS'
  | 'RESTAURANT_FLOORS'
  | 'RESTAURANT_TABLES'
  | 'ORDER_REVIEW'
  | 'POS_EXPENSE'
  | 'HOLD_SALES'
  | 'POS_BILLING'
  | 'REPORTS_MENU'
  | 'PRODUCT_REPORT'
  | 'INVOICE_REPORT'
  | 'CASHIER_REPORT'
  | 'CREDIT_REPORT'
  | 'WAREHOUSE_REPORT'
  | 'STORE_REPORT';

interface UIState {
  activeScreen: AppScreen;
  isLeftMenuOpen: boolean;
  isRightMenuOpen: boolean;
  isCategoriesOpen: boolean;
  billingFlex: number;
  productsFlex: number;
  isChatPopupOpen: boolean;

  // Actions
  setScreen: (screen: AppScreen) => void;
  toggleLeftMenu: (value?: boolean) => void;
  toggleRightMenu: (value?: boolean) => void;
  toggleCategories: (value?: boolean) => void;
  expandBilling: () => void;
  expandProducts: () => void;
  toggleChatPopup: (value?: boolean) => void;
  resetUIState: () => void;
}

// export const useUIStore = create<UIState>()(
//   persist(
export const useUIStore = create<UIState>((set, get) => ({
  activeScreen: 'DEFAULT',
  isLeftMenuOpen: false,
  isRightMenuOpen: false,
  isCategoriesOpen: false,
  billingFlex: 2,
  productsFlex: 1,
  isChatPopupOpen: false,

  setScreen: (screen) => set({ activeScreen: screen }),

  toggleLeftMenu: (value) => set({
    isLeftMenuOpen: value !== undefined ? value : !get().isLeftMenuOpen
  }),

  toggleRightMenu: (value) => set({
    isRightMenuOpen: value !== undefined ? value : !get().isRightMenuOpen
  }),

  toggleCategories: (value) => set({
    isCategoriesOpen: value !== undefined ? value : !get().isCategoriesOpen
  }),

  expandBilling: () => set({
    billingFlex: 2,
    productsFlex: 1
  }),

  expandProducts: () => set({
    billingFlex: 1,
    productsFlex: 2
  }),

  toggleChatPopup: (value) => set({
    isChatPopupOpen: value !== undefined ? value : !get().isChatPopupOpen
  }),

  resetUIState: () => set({
    activeScreen: 'DEFAULT',
    isLeftMenuOpen: false,
    isRightMenuOpen: false,
    isCategoriesOpen: false,
    billingFlex: 2,
    productsFlex: 1,
    isChatPopupOpen: false,
  }),
}));
//     {
//       name: 'app-ui-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
