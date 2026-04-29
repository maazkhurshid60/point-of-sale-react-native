import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';

export const useSplashController = () => {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      delay: 500,
    }).start();

    // Navigation logic after 3 seconds
    const timer = setTimeout(() => {
      if (isUserLoggedIn) {
        navigation.replace('Dashboard' as never);
      } else if (!hasSeenOnboarding) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('SignIn');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim, hasSeenOnboarding, isUserLoggedIn, navigation]);

  return {
    fadeAnim,
  };
};
