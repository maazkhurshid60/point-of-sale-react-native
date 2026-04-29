import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  staticPOSPermissionsList,
  staticPOSCustomerTablePermissionsList,
} from "../constants/permissions";
import { useShiftStore } from "./useShiftStore";
import { useAccountStore } from "./useAccountStore";
import { useSettingsStore } from "./useSettingsStore";
import type { Store } from "../models";

interface AuthState {
  isUserLoggedIn: boolean;
  currentUser: any | null;
  currentStore: any | null;
  authToken: string | null;
  baseURL: string;
  hasSeenOnboarding: boolean;
  permissions: string[];
  customerTablePermissions: string[];

  // Actions
  setBaseURL: (url: string) => void;
  checkClientCode: (clientCode: string) => Promise<boolean>;
  signIn: (clientCode: string, userName: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  completeOnboarding: () => void;
  checkIfPermissionIsGranted: (permission: string) => boolean;
  fetchStoreOptions: () => Promise<Store[]>;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isUserLoggedIn: false,
      currentUser: null,
      currentStore: null,
      authToken: null,
      baseURL: "",
      hasSeenOnboarding: false,
      permissions: [],
      customerTablePermissions: [],

      setBaseURL: (url) => set({ baseURL: url }),

      checkClientCode: async (clientCode) => {
        try {
          if (get().baseURL) return true;
          const res = await axiosClient.get(API_ENDPOINTS.SUPER_ADMIN);
          if (res.data?.success && res.data?.clients) {
            const client = res.data.clients.find((c: any) => c.code === clientCode);
            if (client) {
              get().setBaseURL(`https://${client.domian}`);
              //  get().setBaseURL(`https://${client.domain}`);
              return true;
            }
          }
          return false;
        } catch (e) {
          console.error(e);
          return false;
        }
      },

      signIn: async (clientCode, username, password) => {
        try {
          const isValidClient = await get().checkClientCode(clientCode);
          if (!isValidClient) throw new Error("Invalid Client Code");

          const res = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, null, {
            params: { username, password },
          });

          if (res.status === 200 && res.data?.success) {
            const data = res.data.data;

            const mappedPermissions = (data.permissions || [])
              .map((p: any) => p.name)
              .filter((name: string) => staticPOSPermissionsList.includes(name));

            const mappedCustomerTablePermissions = (data.permissions || [])
              .map((p: any) => p.name)
              .filter((name: string) => staticPOSCustomerTablePermissionsList.includes(name));

            const shift = data.shift || data.result || data.data?.shift || null;
            if (shift && !shift.shift_id && shift.id) {
              shift.shift_id = shift.id;
            }

            set({
              authToken: data.token,
              isUserLoggedIn: true,
              currentUser: data.user,
              currentStore: shift ? shift.store : null,
              permissions: mappedPermissions,
              customerTablePermissions: mappedCustomerTablePermissions,
            });

            // Sync shift state into useShiftStore
            useShiftStore.setState({
              isShiftOpened: !!shift,
              currentShift: shift,
              currentStore: shift ? shift.store : null,
            });

            // Parallel fetch — mirrors Flutter's immediate post-login synchronization
            await Promise.allSettled([
              useSettingsStore.getState().fetchSoftwareSettings(),
              useSettingsStore.getState().fetchLeadSettings(),
              useAccountStore.getState().fetchCashAccounts(shift?.default_cash_account),
              useAccountStore.getState().fetchBankAccounts(shift?.default_bank_account),
              useShiftStore.getState().fetchSalesman(),
            ]);

            return true;
          }
          return false;
        } catch (error) {
          console.error("Login failed", error);
          return false;
        }
      },

      signOut: async () => {
        try {
          await axiosClient.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch {
          // Token may already be invalid — proceed with local cleanup
        } finally {
          get().clearAuthData();
        }
        return true;
      },

      completeOnboarding: () => set({ hasSeenOnboarding: true }),

      checkIfPermissionIsGranted: (permission) =>
        get().permissions.includes(permission),

      fetchStoreOptions: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.STORES);
          return res.data?.success ? res.data.stores : [];
        } catch (e) {
          console.error(e);
          return [];
        }
      },

      clearAuthData: () => {
        set({
          isUserLoggedIn: false,
          authToken: null,
          currentUser: null,
          currentStore: null,
          permissions: [],
          customerTablePermissions: [],
        });
        // Also clear shift data from its own store
        useShiftStore.getState().clearShiftData();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the minimum required for session restoration
      partialize: (state) => ({
        authToken: state.authToken,
        baseURL: state.baseURL,
        isUserLoggedIn: state.isUserLoggedIn,
        hasSeenOnboarding: state.hasSeenOnboarding,
        currentUser: state.currentUser,
        currentStore: state.currentStore,
        permissions: state.permissions,
        customerTablePermissions: state.customerTablePermissions,
      }),
    }
  )
);
