import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { ShiftDetails, Salesman } from "../models";

interface ShiftState {
  isShiftOpened: boolean;
  currentShift: ShiftDetails | null;
  currentShiftData: any | null;
  currentStore: any | null;
  salesmanList: Salesman[];
  selectedSalesman: Salesman | null;

  // Actions
  openShift: (storeId: number, amount: number, posId: string) => Promise<boolean>;
  closeShift: (amount: number) => Promise<boolean>;
  fetchShiftDetails: () => Promise<any>;
  fetchSalesman: () => Promise<Salesman[]>;
  updateSalesman: (salesmanName: string, salesmanId: number) => Promise<boolean>;
  addPOSExpense: (data: any) => Promise<boolean>;
  fetchDailyCashReports: () => Promise<any>;
  clearShiftData: () => void;
}

export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      isShiftOpened: false,
      currentShift: null,
      currentShiftData: null,
      currentStore: null,
      salesmanList: [],
      selectedSalesman: null,

      openShift: async (storeId, amount, posId) => {
        try {
          const res = await axiosClient.post(API_ENDPOINTS.SHIFT.OPEN, {
            store_id: storeId,
            amount: amount,
            pos_id: posId,
          });

          if (res.data?.success || res.data?.result || res.data?.shift) {
            const shiftData = res.data.shift || res.data.result || res.data.data?.shift || res.data;

            if (!shiftData.shift_id && shiftData.id) {
              shiftData.shift_id = shiftData.id;
            }

            set({
              isShiftOpened: true,
              currentShift: shiftData,
              currentShiftData: res.data,
              currentStore: shiftData.store || get().currentStore,
            });

            await Promise.allSettled([
              get().fetchSalesman(),
              get().fetchShiftDetails(),
            ]);

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

          const res = await axiosClient.post(API_ENDPOINTS.SHIFT.CLOSE, null, {
            params: { amount, shift_id: currentShift.shift_id },
          });

          if (res.data?.status === "close" || res.data?.success) {
            set({ isShiftOpened: false, currentShift: null, currentShiftData: null });
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
          if (!currentShift?.shift_id) return null;

          const res = await axiosClient.get(API_ENDPOINTS.SHIFT.DETAILS, {
            params: { shift_id: currentShift.shift_id },
          });

          if (res.data?.success) {
            const shiftData = res.data.result || res.data.shift;
            set({
              currentShiftData: res.data,
              currentStore: shiftData?.store || get().currentStore,
            });
            return res.data;
          }
          return null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },

      fetchSalesman: async () => {
        try {
          const res = await axiosClient.get(API_ENDPOINTS.SHIFT.SALES_MAN);
          const salesmen: Salesman[] = res.data?.success ? res.data.saleman : [];
          const { currentShift } = get();

          let selected: Salesman | null = null;
          if (currentShift?.salesman_id) {
            selected = salesmen.find((s) => s.user_id === currentShift.salesman_id) || null;
          }
          set({ salesmanList: salesmen, selectedSalesman: selected });
          return salesmen;
        } catch (e) {
          console.error(e);
          return [];
        }
      },

      updateSalesman: async (salesmanName, salesmanId) => {
        try {
          const { currentShift, salesmanList } = get();
          if (!currentShift) return false;

          const res = await axiosClient.post(API_ENDPOINTS.TRANSACTIONS.UPDATE_SALESMAN, null, {
            params: { shift_id: currentShift.shift_id, salesman_id: salesmanId },
          });

          if (res.data?.success) {
            const selected = salesmanList.find((s) => s.user_id === salesmanId) || {
              user_id: salesmanId,
              name: salesmanName,
            };
            set((state) => ({
              selectedSalesman: selected,
              currentShift: state.currentShift
                ? { ...state.currentShift, salesman_id: salesmanId, salesman_name: salesmanName }
                : null,
            }));
            return true;
          }
          return false;
        } catch (e) {
          console.error(e);
          return false;
        }
      },

      addPOSExpense: async (data) => {
        try {
          const shiftId = get().currentShift?.shift_id;
          if (!shiftId) throw new Error("No active shift found");

          const { shift_id, ...rest } = data;
          const res = await axiosClient.post(
            API_ENDPOINTS.TRANSACTIONS.ADD_EXPENSE,
            { ...rest, shift_id: shiftId },
            { headers: { "Content-Type": "multipart/form-data" } }
          );
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
            params: { shift_id: shiftId },
          });
          return res.data?.success ? res.data : null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },

      clearShiftData: () => {
        set({
          isShiftOpened: false,
          currentShift: null,
          currentShiftData: null,
          currentStore: null,
          selectedSalesman: null,
        });
      },
    }),
    {
      name: "shift-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isShiftOpened: state.isShiftOpened,
        currentShift: state.currentShift,
        currentStore: state.currentStore,
      }),
    }
  )
);
