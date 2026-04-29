import { useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useNetworkStore } from '../store/useNetworkStore';
import { useAuthStore } from '../store/useAuthStore';

export const useNetworkListener = () => {
  const setNetworkStatus = useNetworkStore((state) => state.setStatus);
  const baseURL = useAuthStore((state) => state.baseURL);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  useEffect(() => {
    // 1. Initial Check
    NetInfo.fetch().then((state) => {
      handleStateChange(state);
    });

    // 2. Continuous Listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      handleStateChange(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStateChange = (state: NetInfoState) => {
    const isOnline = !!state.isConnected && !!state.isInternetReachable;
    const status = isOnline ? 'online' : 'offline';

    setNetworkStatus(status, state.isInternetReachable, state.type);

    if (isOnline && !baseURL && !isUserLoggedIn) {
      console.log('Network back online: Ready for configuration.');
    }
  };
};
