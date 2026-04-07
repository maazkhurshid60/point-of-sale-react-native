import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { 
  Store, POSId, ShiftDetails, CashAccount, BankAccount, 
  CreditCardAccount, Customer, Salesman, Coupon, AccountHead 
} from "../models";

interface AuthState {
  isUserLoggedIn: boolean;
  isShiftOpened: boolean;
  currentUser: any | null;
  currentStore: any | null;
  authToken: string | null;
  baseURL: string;
  setBaseURL: (url: string) => void;
  checkClientCode: (clientCode: string) => Promise<boolean>;
  signIn: (clientCode: string, userName: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  permissions: string[];
  customerTablePermissions: string[];
  softwareSettings: any | null;
  leadSettings: any | null;
  currentShift: ShiftDetails | null;
  
  // Core Actions
  openShift: (storeId: number, amount: number, posId: string) => Promise<boolean>;
  closeShift: (amount: number) => Promise<boolean>;
  fetchShiftDetails: () => Promise<any>;
  generateCoupon: (amount: number) => Promise<Coupon | false>;
  validateCoupon: (number: string) => Promise<Coupon | false>;
  updateCashManagement: (paidIn: string, paidOut: string, notes: string) => Promise<void>;
  addPOSExpense: (data: any) => Promise<void>;
  updateDefaultAccounts: (fbrStatus: boolean) => Promise<boolean>;
  updateCashAccount: (cashAccName: string, cashAccId: number) => Promise<boolean>;
  updateSalesman: (salesmanName: string, salesmanId: number) => Promise<boolean>;
  checkIfPermissionIsGranted: (permission: string) => boolean;
  fetchBankAccounts: () => Promise<BankAccount[]>;
  fetchCashAccounts: () => Promise<CashAccount[]>;
  fetchCreditCardAccounts: () => Promise<CreditCardAccount[]>;
  fetchStoreOptions: () => Promise<Store[]>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isUserLoggedIn: false,
      isShiftOpened: false,
      currentUser: null,
      currentStore: null,
      authToken: null,
      baseURL: "",
      hasSeenOnboarding: false,
      permissions: [],
      customerTablePermissions: [],
      softwareSettings: null,
      leadSettings: null,
      currentShift: null,

      setBaseURL: (url) => {
        set({ baseURL: url });
      },

  checkClientCode: async (clientCode) => {
    try {
      // 1. If base URL is already local, resolve early.
      if (get().baseURL) return true;

      // 2. Fetch clients list from super admin
      const res = await axiosClient.get(API_ENDPOINTS.SUPER_ADMIN);
      if (res.data?.success && res.data?.clients) {
        const client = res.data.clients.find((c: any) => c.code === clientCode);
        if (client) {
          get().setBaseURL(`https://${client.domian}`);
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
        params: { username, password }
      });

      if (res.status === 200 && res.data?.success) {
        const data = res.data.data;
        const token = data.token;
        const userData = data.user;
        const shiftData = data.shift;
        const permissionsList = data.permissions || [];

        if (userData?.status === "in-active") throw new Error("Unauthorized Access");

        // Map Permissions (Matching Flutter staticPOSPermissionsList)
        const mappedPermissions = permissionsList
          .map((p: any) => p.name)
          .filter((name: string) => 
            require('../constants/permissions').staticPOSPermissionsList.includes(name)
          );
        
        const mappedCustomerTablePermissions = permissionsList
          .map((p: any) => p.name)
          .filter((name: string) => 
            require('../constants/permissions').staticPOSCustomerTablePermissionsList.includes(name)
          );

        set({
          authToken: token,
          isUserLoggedIn: true,
          currentUser: userData,
          isShiftOpened: !!shiftData,
          currentStore: shiftData ? shiftData.store : null,
          permissions: mappedPermissions,
          customerTablePermissions: mappedCustomerTablePermissions
        });

        // Parallel fetch settings (Software and Leads)
        try {
          const [softRes, leadRes] = await Promise.all([
            axiosClient.get(API_ENDPOINTS.SETTINGS.SOFTWARE),
            axiosClient.get(API_ENDPOINTS.SETTINGS.LEADS)
          ]);

          if (softRes.data?.success) {
            set({ softwareSettings: softRes.data.settings[0] });
          }
          if (leadRes.data?.success) {
            set({ leadSettings: leadRes.data.settings });
          }
        } catch (settingsError) {
          console.error("Failed to fetch additional settings", settingsError);
        }

        // Sync with Chat Firestore (Background)
        try {
          const { chatService } = require('../services/chatService');
          if (userData && shiftData?.store) {
            chatService.syncUserWithFirestore({
              user_id: userData.user_Id.toString(),
              user_name: userData.username || userData.name,
              store: shiftData.store.store_name,
              client_code: parseInt(clientCode),
              image: userData.image || "",
              is_online: true,
            }).catch((err: any) => console.error("Chat sync error during signIn:", err));
          }
        } catch (e) {
          console.warn("Failed to load chatService for sync:", e);
        }

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
      // Attempt to notify server of logout
      await axiosClient.get(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error: any) {
      // 401 means the token is already invalid, so we just proceed with local cleanup
      if (error?.response?.status !== 401) {
        console.error("Logout API failed (non-401):", error);
      }
    } finally {
      // ALWAYS clear local state to trigger navigation back to Auth
      set({
        isUserLoggedIn: false,
        authToken: null,
        currentUser: null,
        isShiftOpened: false,
        currentStore: null,
        permissions: [],
        customerTablePermissions: [],
        softwareSettings: null,
        leadSettings: null,
        currentShift: null
      });
    }
    return true;
  },

  completeOnboarding: () => {
    set({ hasSeenOnboarding: true });
  },

  openShift: async (storeId, openingAmount, posId) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.SHIFT.OPEN, null, {
        params: { store_id: storeId, amount: openingAmount, fbr_pos_id: posId }
      });
      if (res.data?.success) {
        // Re-run sign-in to refresh shift state as in Flutter
        const { currentUser } = get();
        if (currentUser) {
          // Note: In a real app we'd need the password too, but here we just need to refresh
          // For now, let's just trigger a flag update if the API was successful
          // Sync with Chat Firestore once shift/store is established
          try {
            const { chatService } = require('../services/chatService');
            const { currentStore } = get();
            if (currentUser && currentStore) {
              chatService.syncUserWithFirestore({
                user_id: currentUser.user_Id.toString(),
                user_name: currentUser.username || currentUser.name,
                store: currentStore.store_name,
                image: currentUser.image || "",
                is_online: true,
              }).catch((err: any) => console.error("Chat sync error during openShift:", err));
            }
          } catch (e) {
            console.warn("Failed to load chatService for sync:", e);
          }
          
          set({ isShiftOpened: true });
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  closeShift: async (amount) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return false;
      
      const res = await axiosClient.post(API_ENDPOINTS.SHIFT.CLOSE, null, {
        params: { amount, shift_id: currentShift.shift_id }
      });
      if (res.status === 200) {
        set({ isShiftOpened: false, currentShift: null, currentStore: null });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  fetchShiftDetails: async () => {
    try {
      const { currentShift } = get();
      if (!currentShift) return null;
      const res = await axiosClient.get(API_ENDPOINTS.SHIFT.DETAILS, {
        params: { shift_id: currentShift.shift_id }
      });
      return res.data?.success ? res.data : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },


  generateCoupon: async (amount) => {
    try {
      const { currentShift, currentStore } = get();
      if (!currentShift || !currentStore) return false;

      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.GENERATE_COUPON, null, {
        params: {
          amount,
          store_id: currentStore.store_id,
          shift_id: currentShift.shift_id
        }
      });
      if (res.data?.status && res.data?.data?.coupon) {
        return res.data.data.coupon;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  validateCoupon: async (couponNumber) => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.TRANSACTIONS.VALIDATE_COUPON, {
        params: { coupon_number: couponNumber }
      });
      if (res.data?.status && res.data?.data?.coupon) {
        const coupon = res.data.data.coupon;
        coupon.coupon_amount_left = res.data.data.coupon_amount_left;
        coupon.coupon_amount_formated = res.data.data.coupon_amount_formated;
        return coupon;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  updateCashManagement: async (paidIn, paidOut, notes) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return;
      await axiosClient.get(API_ENDPOINTS.TRANSACTIONS.PAID_IN_OUT, {
        params: {
          shift_id: currentShift.shift_id,
          paid_in: paidIn,
          paid_out: paidOut,
          note: notes
        }
      });
    } catch (e) {
      console.error(e);
    }
  },

  addPOSExpense: async (data) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return;

      const formData = new FormData();
      formData.append('head_id', data.head_id);
      formData.append('account_id', data.account_id);
      formData.append('amount', data.amount);
      formData.append('payment_method', data.payment_method);
      formData.append('payment_account', data.payment_account);
      formData.append('date', data.date);
      formData.append('note', data.note);
      formData.append('shift_id', currentShift.shift_id.toString());
      formData.append('purchase_id', data.po || '');

      if (data.deposit_slip_file) {
        // Expo Image Picker result format
        const file = data.deposit_slip_file;
        formData.append('supplier_deposit_slip', {
          uri: file.uri,
          name: file.fileName || 'upload.jpg',
          type: file.type || 'image/jpeg'
        } as any);
      }

      await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.ADD_EXPENSE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (e) {
      console.error(e);
    }
  },

  updateDefaultAccounts: async (fbrStatus) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return false;

      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_DEFAULTS, null, {
        params: {
          shift_id: currentShift.shift_id,
          default_cash_account: currentShift.default_cash_account,
          default_bank_account: currentShift.default_bank_account,
          default_card_account: currentShift.default_card_account,
        }
      });
      return !!res.data?.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  updateCashAccount: async (cashAccName, cashAccId) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return false;
      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_CASH_ACCOUNT, {
        shift_id: currentShift.shift_id,
        default_cash_account: cashAccId
      });
      if (res.data?.success) {
        // Update local state if needed
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  updateSalesman: async (salesmanName, salesmanId) => {
    try {
      const { currentShift } = get();
      if (!currentShift) return false;
      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_SALESMAN, null, {
        params: {
          shift_id: currentShift.shift_id,
          salesman_id: salesmanId
        }
      });
      return !!res.data?.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  checkIfPermissionIsGranted: (permission: string) => {
    return get().permissions.includes(permission);
  },

  fetchBankAccounts: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.BANK_ACCOUNTS);
      return res.data?.success ? res.data.accounts : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  fetchCashAccounts: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CASH_ACCOUNTS);
      return res.data?.success ? res.data.accounts : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  fetchCreditCardAccounts: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CREDIT_CARD_ACCOUNTS);
      return res.data?.success ? res.data.accounts : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  fetchStoreOptions: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.STORES);
      return res.data?.success ? res.data.stores : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

}),
{
  name: "auth-storage",
  storage: createJSONStorage(() => AsyncStorage),
}
)
);
