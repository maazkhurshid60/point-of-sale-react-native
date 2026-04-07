import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import { useAuthStore } from '../store/useAuthStore';
import { View, Text, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

// Temporary Dashboard Placeholder to verify Auth success
// In a full migration, this will be replaced by the TabNavigator or similar
function DashboardScreen() {
  const signOut = useAuthStore((state: any) => state.signOut);
  const currentUser = useAuthStore((state: any) => state.currentUser);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F6FB' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#1C1B1F' }}>Welcome to POS V2!</Text>
      <Text style={{ fontSize: 16, color: '#757575', marginBottom: 30 }}>Logged in as: {currentUser?.username || 'User'}</Text>

      <TouchableOpacity
        onPress={signOut}
        style={{ paddingVertical: 14, paddingHorizontal: 40, backgroundColor: '#ef4444', borderRadius: 12, elevation: 2 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootNavigator() {
  const isUserLoggedIn = useAuthStore((state: any) => state.isUserLoggedIn);
  const hasSeenOnboarding = useAuthStore((state: any) => state.hasSeenOnboarding);

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
        // App Stack
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      )}
    </Stack.Navigator>
  );
}
