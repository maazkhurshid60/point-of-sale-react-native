import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  Store, POSId, ShiftDetails, CashAccount, BankAccount,
  CreditCardAccount, Customer, Salesman, Coupon, AccountHead,
  FloorModel, TableModel, DecorationModel, POAccount
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
  currentShiftData: any | null;
  cashAccounts: CashAccount[];

  // Restaurant Table Management State
  currentFloor: FloorModel | null;
  listOfFloors: FloorModel[];
  listOfTables: TableModel[];
  listofdecorations: DecorationModel[];
  accountHeads: AccountHead[];
  purchaseOrders: POAccount[];

  // Core Actions
  openShift: (storeId: number, amount: number, posId: string) => Promise<boolean>;
  closeShift: (amount: number) => Promise<boolean>;
  fetchShiftDetails: () => Promise<any>;
  generateCoupon: (amount: number) => Promise<Coupon | false>;
  validateCoupon: (number: string) => Promise<Coupon | false>;
  updateDefaultAccounts: (cashId: number | string, bankId: number | string, cardId: number | string, fbrStatus: boolean) => Promise<boolean>;
  updateCashAccount: (cashAccName: string, cashAccId: number) => Promise<boolean>;
  updateSalesman: (salesmanName: string, salesmanId: number) => Promise<boolean>;
  checkIfPermissionIsGranted: (permission: string) => boolean;
  fetchBankAccounts: () => Promise<BankAccount[]>;
  fetchCashAccounts: () => Promise<CashAccount[]>;
  fetchCreditCardAccounts: () => Promise<CreditCardAccount[]>;
  fetchStoreOptions: () => Promise<Store[]>;
  fetchAccountHeads: () => Promise<AccountHead[]>;
  fetchPurchaseOrders: () => Promise<POAccount[]>;
  addPOSExpense: (data: any) => Promise<boolean>;
  fetchDailyCashReports: () => Promise<any>;
  fetchCustomers: () => Promise<Customer[]>;
  addNewCustomer: (details: any) => Promise<boolean>;

  // Table Management Actions
  setCurrentFloor: (floor: FloorModel) => void;
  addFloor: () => void;
  removeFloor: () => void;
  addTable: (floorId: number) => void;
  removeTable: (tableId: number) => void;
  updateTablePosition: (tableId: number, x: number, y: number) => void;
  clearAuthData: () => void;
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
      currentShiftData: null,
      cashAccounts: [],
      currentFloor: null,
      listOfFloors: [],
      listOfTables: [],
      listofdecorations: [],
      accountHeads: [],
      purchaseOrders: [],

      setBaseURL: (url) => {
        set({ baseURL: url });
      },

      checkClientCode: async (clientCode) => {
        try {
          if (get().baseURL) return true;
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
            const mappedPermissions = (data.permissions || [])
              .map((p: any) => p.name)
              .filter((name: string) =>
                require('../constants/permissions').staticPOSPermissionsList.includes(name)
              );

            const mappedCustomerTablePermissions = (data.permissions || [])
              .map((p: any) => p.name)
              .filter((name: string) =>
                require('../constants/permissions').staticPOSCustomerTablePermissionsList.includes(name)
              );

            set({
              authToken: data.token,
              isUserLoggedIn: true,
              currentUser: data.user,
              isShiftOpened: !!data.shift,
              currentShift: data.shift || null,
              currentStore: data.shift ? data.shift.store : null,
              permissions: mappedPermissions,
              customerTablePermissions: mappedCustomerTablePermissions
            });

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
        } catch (error) {
          console.log("SignOut cleanup");
        } finally {
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

      openShift: async (storeId, amount, posId) => {
        try {
          // POST body matches Flutter's storeshift payload
          const res = await axiosClient.post(API_ENDPOINTS.SHIFT.OPEN, {
            store_id: storeId,
            amount: amount,
            pos_id: posId,
          });

          if (res.data?.success || res.data?.result) {
            const shiftData = res.data.result || res.data;
            set({
              isShiftOpened: true,
              currentShift: shiftData,
              currentShiftData: res.data // Store full details if available
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error("Open Shift Error:", e);
          return false;
        }
      },

      closeShift: async (amount) => {
        try {
          const { currentShift } = get();
          if (!currentShift) {
            console.warn("No active shift found to close.");
            return false;
          }

          // Parameters as query strings for POST request as per user report
          const res = await axiosClient.post(API_ENDPOINTS.SHIFT.CLOSE, null, {
            params: {
              amount: amount,
              shift_id: currentShift.shift_id
            }
          });

          if (res.data?.status === "close" || res.data?.success) {
            set({
              isShiftOpened: false,
              currentShift: null,
              currentShiftData: null,
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error("Close Shift Error:", e);
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
          if (res.data?.success) {
            set({ currentShiftData: res.data });
            return res.data;
          }
          return null;
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
            params: { amount, store_id: currentStore.store_id, shift_id: currentShift.shift_id }
          });
          return res.data?.status && res.data?.data?.coupon ? res.data.data.coupon : false;
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

      updateDefaultAccounts: async (cashId: number | string, bankId: number | string, cardId: number | string, fbrStatus: boolean) => {
        try {
          const { currentShift } = get();
          if (!currentShift) return false;
          const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_DEFAULTS, null, {
            params: {
              shift_id: currentShift.shift_id,
              default_cash_account: cashId,
              default_bank_account: bankId,
              default_card_account: cardId,
            }
          });
          if (res.data?.success) {
            set((state) => ({
              currentShift: {
                ...state.currentShift!,
                default_cash_account: cashId ? Number(cashId) : state.currentShift!.default_cash_account,
                default_bank_account: bankId ? Number(bankId) : state.currentShift!.default_bank_account,
                default_card_account: cardId ? Number(cardId) : state.currentShift!.default_card_account,
                fbr_sales_enabled: fbrStatus,
              }
            }));
            return true;
          }
          return false;
        } catch (e) { console.error(e); return false; }
      },

      updateCashAccount: async (cashAccName: string, cashAccId: number) => {
        try {
          const { currentShift } = get();
          if (!currentShift) return false;
          const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_CASH_ACCOUNT, {
            shift_id: currentShift.shift_id,
            default_cash_account: cashAccId
          });
          return !!res.data?.success;
        } catch (e) { console.error(e); return false; }
      },

      updateSalesman: async (salesmanName: string, salesmanId: number) => {
        try {
          const { currentShift } = get();
          if (!currentShift) return false;
          const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_SALESMAN, null, {
            params: { shift_id: currentShift.shift_id, salesman_id: salesmanId }
          });
          return !!res.data?.success;
        } catch (e) { console.error(e); return false; }
      },

      checkIfPermissionIsGranted: (permission: string) => {
        return get().permissions.includes(permission);
      },

      fetchBankAccounts: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.BANK_ACCOUNTS);
          return res.data?.success ? res.data.accounts : [];
        } catch (e) { console.error(e); return []; }
      },

      fetchCashAccounts: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CASH_ACCOUNTS);
          const accounts = res.data?.success ? res.data.accounts : [];
          set({ cashAccounts: accounts });
          return accounts;
        } catch (e) { console.error(e); return []; }
      },

      fetchCreditCardAccounts: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CREDIT_CARD_ACCOUNTS);
          return res.data?.success ? res.data.accounts : [];
        } catch (e) { console.error(e); return []; }
      },

      fetchStoreOptions: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.STORES);
          return res.data?.success ? res.data.stores : [];
        } catch (e) { console.error(e); return []; }
      },

      fetchAccountHeads: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.ACCOUNT_HEADS);
          const heads = res.data?.success ? res.data.heads : [];
          set({ accountHeads: heads });
          return heads;
        } catch (e) { console.error(e); return []; }
      },

      fetchPurchaseOrders: async () => {
        try {
          const res = await axiosClient.post(API_ENDPOINTS.CATALOG.PO_LIST);
          const pos = res.data?.success ? res.data.purchaseOrders : [];
          set({ purchaseOrders: pos });
          return pos;
        } catch (e) { console.error(e); return []; }
      },

      addPOSExpense: async (data: any) => {
        try {
          const shiftId = get().currentShift?.shift_id;
          if (!shiftId) throw new Error("No active shift found");

          const { shift_id, ...rest } = data;
          const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.ADD_EXPENSE, {
            ...rest,
            shift_id: shiftId,
          }, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          return res.data?.success || false;
        } catch (e) {
          console.error(e);
          return false;
        }
      },

      fetchDailyCashReports: async () => {
        try {
          const shiftId = get().currentShift?.shift_id;
          if (!shiftId) return null;
          const res = await axiosClient.get(API_ENDPOINTS.SHIFT.DAILY_REPORTS, {
            params: { shift_id: shiftId }
          });
          return res.data?.success ? res.data : null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },

      fetchCustomers: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CUSTOMERS);
          return res.data?.success ? res.data.customers : [];
        } catch (e) {
          console.error(e);
          return [];
        }
      },

      addNewCustomer: async (details) => {
        try {
          const res = await axiosClient.post(API_ENDPOINTS.CATALOG.CUSTOMERS, details);
          return !!res.data?.success;
        } catch (e) {
          console.error(e);
          return false;
        }
      },

      // Table Management Implementation
      setCurrentFloor: (floor) => set({ currentFloor: floor }),
      addFloor: () => {
        const { listOfFloors } = get();
        const newFloor: FloorModel = {
          floorId: listOfFloors.length + 1,
          floorName: `Floor ${listOfFloors.length + 1}`,
          storeid: 1,
          floorNo: (listOfFloors.length + 1).toString(),
          noOfTable: 10,
        };
        set({ listOfFloors: [...listOfFloors, newFloor], currentFloor: newFloor });
      },
      removeFloor: () => {
        const { listOfFloors } = get();
        if (listOfFloors.length <= 1) return;
        const newList = [...listOfFloors];
        newList.pop();
        set({ listOfFloors: newList, currentFloor: newList[newList.length - 1] });
      },
      addTable: (floorId) => {
        const { listOfTables } = get();
        const newTable: TableModel = {
          tableId: Date.now(),
          tableName: `Table ${listOfTables.length + 1}`,
          floorid: floorId,
          x: 50,
          y: 50,
          width: 80,
          height: 80,
          isRounded: false,
          rotation: 0,
          chairsCount: 4,
          listofChairs: [1, 1, 1, 1],
          isSelected: false,
        };
        set({ listOfTables: [...listOfTables, newTable] });
      },
      removeTable: (tableId) => {
        set((state) => ({
          listOfTables: state.listOfTables.filter((t) => t.tableId !== tableId),
        }));
      },
      updateTablePosition: (tableId: number, x: number, y: number) => {
        set((state) => ({
          listOfTables: state.listOfTables.map((t) =>
            t.tableId === tableId ? { ...t, x, y } : t
          ),
        }));
      },

      clearAuthData: () => {
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
          currentShift: null,
          currentShiftData: null
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
