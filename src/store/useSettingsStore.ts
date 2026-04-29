import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { SoftwareSettings } from "../models";

interface SettingsState {
  softwareSettings: SoftwareSettings | null;
  leadSettings: any | null;

  // Actions
  fetchSoftwareSettings: () => Promise<void>;
  fetchLeadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  softwareSettings: null,
  leadSettings: null,

  fetchSoftwareSettings: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.SETTINGS.SOFTWARE);
      if (res.data?.success && res.data?.settings) {
        // Uses first index of settings list — mirrors Flutter AuthController behaviour
        set({ softwareSettings: res.data.settings[0] });
      }
    } catch (e) {
      console.error("Fetch Software Settings Error:", e);
    }
  },

  fetchLeadSettings: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.SETTINGS.LEADS);
      if (res.data?.success && res.data?.settings) {
        set({ leadSettings: res.data.settings });
      }
    } catch (e) {
      console.error("Fetch Lead Settings Error:", e);
    }
  },
}));
