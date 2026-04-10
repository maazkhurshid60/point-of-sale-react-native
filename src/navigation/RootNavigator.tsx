import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/Auth/SignInScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
// import DashboardScreen from '../screens/Dashboard/DashboardScreen'; 
import { useAuthStore } from '../store/useAuthStore';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isUserLoggedIn ? (
        // Auth Stack
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          {!hasSeenOnboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // App Stack - Temporarily using SignIn to test if error clears
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      )}
    </Stack.Navigator>
  );
}
