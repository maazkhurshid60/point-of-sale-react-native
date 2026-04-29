import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { CashAccount, BankAccount, CreditCardAccount, Coupon, AccountHead, POAccount } from "../models";

interface AccountState {
  cashAccounts: CashAccount[];
  bankAccounts: BankAccount[];
  creditCardAccounts: CreditCardAccount[];
  selectedCashAccountId: number | null;
  selectedBankAccountId: number | null;
  selectedCreditCardAccountId: number | null;
  selectedCashAccount: CashAccount | null;
  selectedBankAccount: BankAccount | null;
  accountHeads: AccountHead[];
  purchaseOrders: POAccount[];

  // Actions
  setSelectedCashAccount: (account: CashAccount | null) => void;
  setSelectedBankAccount: (account: BankAccount | null) => void;
  fetchCashAccounts: (defaultId?: number | null) => Promise<CashAccount[]>;
  fetchBankAccounts: (defaultId?: number | null) => Promise<BankAccount[]>;
  fetchCreditCardAccounts: () => Promise<CreditCardAccount[]>;
  fetchAccountHeads: () => Promise<AccountHead[]>;
  fetchPurchaseOrders: () => Promise<POAccount[]>;
  updateDefaultCashAccount: (accountId: number, shiftId: number) => Promise<boolean>;
  updateDefaultAccounts: (
    cashId: number | string,
    bankId: number | string,
    cardId: number | string,
    fbrStatus: boolean,
    shiftId: number
  ) => Promise<boolean>;
  generateCoupon: (amount: number, storeId: number, shiftId: number) => Promise<Coupon | false>;
  validateCoupon: (couponNumber: string) => Promise<Coupon | false>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  cashAccounts: [],
  bankAccounts: [],
  creditCardAccounts: [],
  selectedCashAccountId: null,
  selectedBankAccountId: null,
  selectedCreditCardAccountId: null,
  selectedCashAccount: null,
  selectedBankAccount: null,
  accountHeads: [],
  purchaseOrders: [],

  setSelectedCashAccount: (account) => set({ selectedCashAccount: account }),
  setSelectedBankAccount: (account) => set({ selectedBankAccount: account }),

  fetchAccountHeads: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.ACCOUNT_HEADS);
      const heads: AccountHead[] = res.data?.success ? res.data.heads : [];
      set({ accountHeads: heads });
      return heads;
    } catch (e) { console.error(e); return []; }
  },

  fetchPurchaseOrders: async () => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.CATALOG.PO_LIST);
      const pos: POAccount[] = res.data?.success ? res.data.purchaseOrders : [];
      set({ purchaseOrders: pos });
      return pos;
    } catch (e) { console.error(e); return []; }
  },

  fetchCashAccounts: async (defaultId) => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CASH_ACCOUNTS);
      const accounts: CashAccount[] = res.data?.success ? res.data.accounts : [];

      const shiftDefaultAcc = defaultId
        ? accounts.find((a) => a.id === defaultId)
        : null;
      const selectedAcc = shiftDefaultAcc || (accounts.length > 0 ? accounts[0] : null);

      set({
        cashAccounts: accounts,
        selectedCashAccountId: selectedAcc?.id ?? null,
        selectedCashAccount: selectedAcc,
      });
      return accounts;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  fetchBankAccounts: async (defaultId) => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.BANK_ACCOUNTS);
      const accounts: BankAccount[] = res.data?.success ? res.data.accounts : [];

      const shiftDefaultAcc = defaultId
        ? accounts.find((a) => a.id === defaultId)
        : null;
      const selectedAcc = shiftDefaultAcc || (accounts.length > 0 ? accounts[0] : null);

      set({
        bankAccounts: accounts,
        selectedBankAccountId: selectedAcc?.id ?? null,
        selectedBankAccount: selectedAcc,
      });
      return accounts;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  fetchCreditCardAccounts: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CATALOG.CREDIT_CARD_ACCOUNTS);
      const accounts: CreditCardAccount[] = res.data?.success ? res.data.accounts : [];
      const firstAccount = accounts.length > 0 ? accounts[0] : null;
      set({
        creditCardAccounts: accounts,
        selectedCreditCardAccountId: firstAccount?.id ?? null,
      });
      return accounts;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  updateDefaultCashAccount: async (accountId, shiftId) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_CASH_ACCOUNT, {
        shift_id: shiftId,
        default_cash_account: accountId,
      });

      if (res.data?.success) {
        const account = get().cashAccounts.find((a) => a.id === accountId) || null;
        set({ selectedCashAccount: account, selectedCashAccountId: accountId });
        return true;
      }
    } catch (e) {
      console.error("Failed to update default cash account", e);
    }
    return false;
  },

  updateDefaultAccounts: async (cashId, bankId, cardId, fbrStatus, shiftId) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_DEFAULTS, null, {
        params: {
          shift_id: shiftId,
          default_cash_account: cashId,
          default_bank_account: bankId,
          default_card_account: cardId,
        },
      });
      
      if (res.data?.success) {
        // Sync local state so POS/Payment screens reflect changes immediately
        const cashAcc = get().cashAccounts.find(a => a.id === Number(cashId)) || null;
        const bankAcc = get().bankAccounts.find(a => a.id === Number(bankId)) || null;
        
        set({
          selectedCashAccountId: Number(cashId),
          selectedCashAccount: cashAcc,
          selectedBankAccountId: Number(bankId),
          selectedBankAccount: bankAcc,
          selectedCreditCardAccountId: Number(cardId),
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  generateCoupon: async (amount, storeId, shiftId) => {
    try {
      const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.GENERATE_COUPON, null, {
        params: { amount, store_id: storeId, shift_id: shiftId },
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
        params: { coupon_number: couponNumber },
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
}));
