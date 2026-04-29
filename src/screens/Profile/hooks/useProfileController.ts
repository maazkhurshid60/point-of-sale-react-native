import { useWindowDimensions } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import { useShiftStore } from '../../../store/useShiftStore';
import { useUIStore } from '../../../store/useUIStore';

export const useProfileController = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isPortrait = height > width;

  const currentUser = useAuthStore((state) => state.currentUser);
  const currentStore = useShiftStore((state) => state.currentStore);
  const setScreen = useUIStore((state) => state.setScreen);

  return {
    isTablet,
    isPortrait,
    currentUser,
    currentStore,
    setScreen,
  };
};
