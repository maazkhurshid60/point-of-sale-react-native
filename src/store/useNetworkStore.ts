import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ConnectivityStatus = 'online' | 'offline';
export type SalesHandlerStatus = 'remote' | 'offline';

interface NetworkState {
    connectivityStatus: ConnectivityStatus;
    salesHandler: SalesHandlerStatus;
    isInternetReachable: boolean | null;
    type: string | null;
    widgetX: number;
    widgetY: number;

    // Actions
    setStatus: (status: ConnectivityStatus, isReachable: boolean | null, type: string | null) => void;
    toggleNetwork: (isOnline: boolean) => void;
    checkConnectivity: () => Promise<boolean>;
    setWidgetPosition: (x: number, y: number) => void;
}

export const useNetworkStore = create<NetworkState>()(
    persist(
        (set, get) => ({
            connectivityStatus: 'offline',
            salesHandler: 'offline',
            isInternetReachable: null,
            type: null,
            widgetX: 20, // Default margin from right
            widgetY: 20, // Default margin from bottom

            setStatus: (status, isReachable, type) => {
                set({
                    connectivityStatus: status,
                    salesHandler: status === 'online' ? 'remote' : 'offline',
                    isInternetReachable: isReachable,
                    type: type,
                });
            },

            toggleNetwork: (isOnline) => {
                set({
                    connectivityStatus: isOnline ? 'online' : 'offline',
                    salesHandler: isOnline ? 'remote' : 'offline',
                });
            },

            setWidgetPosition: (x, y) => {
                set({ widgetX: x, widgetY: y });
            },

            checkConnectivity: async () => {
                const NetInfo = require('@react-native-community/netinfo').default;
                const state = await NetInfo.fetch();
                const isOnline = !!state.isConnected && !!state.isInternetReachable;
                return isOnline;
            },
        }),
        {
            name: 'network-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
