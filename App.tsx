import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/navigation/RootNavigator';
const queryClient = new QueryClient();

function AppContent() {

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
        {/* <GlobalDialogManager /> */}
      </NavigationContainer>
      {/* <InternetConnectivityStatusWidget /> */}
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
