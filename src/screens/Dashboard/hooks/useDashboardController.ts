import { useEffect } from 'react';
import { useUIStore } from '../../../store/useUIStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { useDialogStore } from '../../../store/useDialogStore';
import { useAccountStore } from '../../../store/useAccountStore';
import { useCustomerStore } from '../../../store/useCustomerStore';
import { useAuthStore } from '../../../store/useAuthStore';

export const useDashboardController = () => {
  const activeScreen = useUIStore((state) => state.activeScreen);
  const toggleLeftMenu = useUIStore((state) => state.toggleLeftMenu);
  const toggleRightMenu = useUIStore((state) => state.toggleRightMenu);
  const setScreen = useUIStore((state) => state.setScreen);

  const isShiftOpened = useShiftStore((state) => state.isShiftOpened);
  const showDialog = useDialogStore((state) => state.showDialog);
  const signOut = useAuthStore((state) => state.signOut);

  // Fetch initial data
  useEffect(() => {
    if (isShiftOpened) {
      useShiftStore.getState().fetchSalesman();
      useCustomerStore.getState().fetchCustomers();
      useAccountStore.getState().fetchBankAccounts();
      useAccountStore.getState().fetchCashAccounts();
      useAccountStore.getState().fetchCreditCardAccounts();
    }
  }, [isShiftOpened]);

  // Shift Protection Logic
  useEffect(() => {
    const exemptedScreens = [
      'DEFAULT', 'PROFILE', 'POS_SETTINGS', 'REPORTS_MENU', 'SHIFT_DETAILS',
      'PRODUCT_REPORT', 'INVOICE_REPORT', 'CASHIER_REPORT', 'CREDIT_REPORT',
      'WAREHOUSE_REPORT', 'STORE_REPORT', 'DAILY_REPORT'
    ];

    if (!exemptedScreens.includes(activeScreen) && !isShiftOpened) {
      showDialog('OPEN_SHIFT', {});
      setScreen('DEFAULT');
    }
  }, [activeScreen, isShiftOpened, showDialog, setScreen]);

  return {
    activeScreen,
    toggleLeftMenu,
    toggleRightMenu,
    setScreen,
    isShiftOpened,
    signOut,
  };
};
