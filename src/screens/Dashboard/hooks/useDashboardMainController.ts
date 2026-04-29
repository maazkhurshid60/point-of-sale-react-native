import { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { useUIStore } from '../../../store/useUIStore';
import { useDialogStore } from '../../../store/useDialogStore';

export const useDashboardMainController = () => {
  const { width: screenWidth } = useWindowDimensions();
  const isTabletOrLaptop = screenWidth > 800;

  const isShiftOpened = useShiftStore((state) => state.isShiftOpened);
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentStore = useShiftStore((state) => state.currentStore);

  const fetchShiftDetails = useShiftStore((state) => state.fetchShiftDetails);
  const fetchDailyCashReports = useShiftStore((state) => state.fetchDailyCashReports);

  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchShiftDetails(),
        fetchDailyCashReports()
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  }, [fetchShiftDetails, fetchDailyCashReports]);

  const handlePOSClick = useCallback(() => {
    if (isShiftOpened) {
      setScreen('POS_BILLING');
    } else {
      showDialog('OPEN_SHIFT', {});
    }
  }, [isShiftOpened, setScreen, showDialog]);

  const statCardWidth = isTabletOrLaptop ? (screenWidth - 80) / 4 : (screenWidth - 52) / 2;
  const navCardWidth = isTabletOrLaptop ? (screenWidth - 88) / 3 : (screenWidth - 40);

  return {
    // State & Dimensions
    isTabletOrLaptop,
    screenWidth,
    refreshing,

    // Data
    isShiftOpened,
    currentUser,
    currentStore,

    // Derived
    statCardWidth,
    navCardWidth,

    // Actions
    onRefresh,
    handlePOSClick,
    setScreen,
  };
};
