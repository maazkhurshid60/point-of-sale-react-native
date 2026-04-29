import { useWindowDimensions, DimensionValue } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { useUIStore } from '../../../store/useUIStore';
import { useDialogStore } from '../../../store/useDialogStore';
import { useShiftDetails } from '../../../api/shift/queries';

export const useShiftController = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isLandscape = width > height;
  const isLargeTablet = width > 1024;

  const currentShift = useShiftStore((state) => state.currentShift);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  const { data: currentShiftData, isLoading: loading, refetch, isError } = useShiftDetails(currentShift?.shift_id);

  const contentMaxWidth: DimensionValue = isLargeTablet ? 1200 : isTablet ? 1000 : '100%';

  return {
    // State
    isTablet,
    isLandscape,
    isLargeTablet,
    contentMaxWidth,
    currentShift,
    currentUser,
    currentShiftData,
    loading,
    isError,
    
    // Actions
    setScreen,
    showDialog,
    refetch,
  };
};
