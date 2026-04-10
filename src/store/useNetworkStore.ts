import { create } from 'zustand';

export type ConnectivityStatus = 'online' | 'offline';
export type SalesHandlerStatus = 'remote' | 'offline';

interface NetworkState {
    connectivityStatus: ConnectivityStatus;
    salesHandler: SalesHandlerStatus;
    isInternetReachable: boolean | null;
    type: string | null;

    // Actions
    setStatus: (status: ConnectivityStatus, isReachable: boolean | null, type: string | null) => void;
    toggleNetwork: (isOnline: boolean) => void;
    checkConnectivity: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
    connectivityStatus: 'offline',
    salesHandler: 'offline',
    isInternetReachable: null,
    type: null,

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

    checkConnectivity: async () => {
        const NetInfo = require('@react-native-community/netinfo').default;
        const state = await NetInfo.fetch();
        const isOnline = !!state.isConnected && !!state.isInternetReachable;
        return isOnline;
    },
}));
