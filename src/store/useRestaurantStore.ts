import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { FloorModel, TableModel, DecorationModel } from "../models";

interface RestaurantState {
  currentFloor: FloorModel | null;
  listOfFloors: FloorModel[];
  listOfTables: TableModel[];
  listofdecorations: DecorationModel[];
  lastResponseKeys: string | null;
  // IDs of floors that were deleted locally but not yet synced with the server
  deletedFloorIds: number[];

  // Floor Actions
  setCurrentFloor: (floor: FloorModel) => void;
  addFloor: () => FloorModel;
  removeFloor: () => void;
  updateFloorName: (floorId: number, name: string) => void;
  updateFloorCapacity: (floorId: number, capacity: number) => void;

  // Table Actions
  addTable: (floorId: number) => "CAPACITY_REACHED" | void;
  removeTable: (tableId: number) => void;
  updateTablePosition: (tableId: number, x: number, y: number) => void;
  updateTableSize: (tableId: number, width: number, height: number) => void;
  updateTableRotation: (tableId: number, rotation: number) => void;
  toggleTableShape: (tableId: number) => void;
  updateTableSelection: (tableId: number | null) => void;
  updateTableName: (tableId: number, name: string) => void;
  addChair: (tableId: number) => void;
  removeChair: (tableId: number) => void;

  // Decoration Actions
  addDecoration: (floorId: number) => void;
  removeDecoration: (id: number) => void;
  updateDecorationPosition: (id: number, x: number, y: number) => void;
  updateDecorationSelection: (id: number | null) => void;

  // API Actions
  fetchFloors: () => Promise<FloorModel[]>;
  fetchFloorDetails: (id: number) => Promise<boolean>;
  saveFloorLayout: () => Promise<{ success: boolean; message?: string }>;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  currentFloor: null,
  listOfFloors: [],
  listOfTables: [],
  listofdecorations: [],
  lastResponseKeys: null,
  deletedFloorIds: [],

  // ─── Floor Actions ──────────────────────────────────────────────────────────
  setCurrentFloor: (floor) => set({ currentFloor: floor }),

  addFloor: () => {
    const { listOfFloors } = get();
    const newFloor: FloorModel = {
      floorId: Date.now(),
      floorName: `Floor ${listOfFloors.length + 1}`,
      floorNo: (listOfFloors.length + 1).toString(),
      noOfTable: 10,
      storeid: 1,
    };
    set({ listOfFloors: [...listOfFloors, newFloor], currentFloor: newFloor });
    return newFloor;
  },

  removeFloor: () => {
    const { listOfFloors, currentFloor, listOfTables, listofdecorations, deletedFloorIds } = get();
    if (!currentFloor) return;
    const targetId = currentFloor.floorId;
    const newList = listOfFloors.filter((f) => f.floorId !== targetId);
    // Only track real server IDs (not temporary local IDs > 1_000_000_000)
    const newDeletedIds = targetId < 1_000_000_000
      ? [...deletedFloorIds, targetId]
      : deletedFloorIds;
    set({
      listOfFloors: newList,
      currentFloor: newList.length > 0 ? newList[0] : null,
      listOfTables: listOfTables.filter((t) => t.floorid !== targetId),
      listofdecorations: listofdecorations.filter((d) => d.floor !== targetId),
      deletedFloorIds: newDeletedIds,
    });
  },

  updateFloorName: (floorId, name) => {
    set((state) => ({
      listOfFloors: state.listOfFloors.map((f) =>
        f.floorId === floorId ? { ...f, floorName: name } : f
      ),
      currentFloor:
        state.currentFloor?.floorId === floorId
          ? { ...state.currentFloor, floorName: name }
          : state.currentFloor,
    }));
  },

  updateFloorCapacity: (floorId, capacity) => {
    set((state) => ({
      listOfFloors: state.listOfFloors.map((f) =>
        f.floorId === floorId ? { ...f, noOfTable: capacity } : f
      ),
      currentFloor:
        state.currentFloor?.floorId === floorId
          ? { ...state.currentFloor, noOfTable: capacity }
          : state.currentFloor,
    }));
  },

  // ─── Table Actions ──────────────────────────────────────────────────────────
  addTable: (floorId) => {
    const state = get();
    const floor = state.listOfFloors.find((f) => f.floorId === floorId);
    const capacity = floor?.noOfTable || 0;
    const currentTables = state.listOfTables.filter((t) => t.floorid === floorId);
    if (currentTables.length >= capacity) return "CAPACITY_REACHED";

    const newTable: TableModel = {
      tableId: Date.now(),
      tableName: `Table ${state.listOfTables.length + 1}`,
      floorid: floorId,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: 80,
      height: 80,
      isRounded: false,
      rotation: 0,
      chairsCount: 4,
      listofChairs: [1, 1, 1, 1],
      isSelected: false,
    };
    set({ listOfTables: [...state.listOfTables, newTable] });
  },

  removeTable: (tableId) => {
    set((state) => ({
      listOfTables: state.listOfTables.filter((t) => t.tableId !== tableId),
    }));
  },

  updateTablePosition: (tableId, x, y) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) =>
        t.tableId === tableId ? { ...t, x, y } : t
      ),
    }));
  },

  updateTableSize: (tableId, width, height) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) =>
        t.tableId === tableId ? { ...t, width, height } : t
      ),
    }));
  },

  updateTableRotation: (tableId, rotation) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) =>
        t.tableId === tableId ? { ...t, rotation } : t
      ),
    }));
  },

  toggleTableShape: (tableId) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) =>
        t.tableId === tableId ? { ...t, isRounded: !t.isRounded } : t
      ),
    }));
  },

  updateTableSelection: (tableId) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) => ({
        ...t,
        isSelected: t.tableId === tableId,
      })),
    }));
  },

  updateTableName: (tableId, name) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) =>
        t.tableId === tableId ? { ...t, tableName: name } : t
      ),
    }));
  },

  addChair: (tableId) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) => {
        if (t.tableId !== tableId || t.chairsCount >= 16) return t;
        const newChairs = [...t.listofChairs];
        let sideIndex = 0;
        let minChairs = newChairs[0];
        for (let i = 1; i < 4; i++) {
          if (newChairs[i] < minChairs) {
            minChairs = newChairs[i];
            sideIndex = i;
          }
        }
        newChairs[sideIndex] += 1;
        return { ...t, listofChairs: newChairs, chairsCount: t.chairsCount + 1 };
      }),
    }));
  },

  removeChair: (tableId) => {
    set((state) => ({
      listOfTables: state.listOfTables.map((t) => {
        if (t.tableId !== tableId || t.chairsCount === 0) return t;
        const newChairs = [...t.listofChairs];
        const sideIndex = newChairs.findIndex((c) => c > 0);
        if (sideIndex !== -1) newChairs[sideIndex] -= 1;
        return { ...t, listofChairs: newChairs, chairsCount: Math.max(0, t.chairsCount - 1) };
      }),
    }));
  },

  // ─── Decoration Actions ─────────────────────────────────────────────────────
  addDecoration: (floorId) => {
    const newDeco: DecorationModel = {
      id: Date.now(),
      floor: floorId,
      title: "Leaf",
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: 35,
      height: 35,
      isSelected: false,
    };
    set((state) => ({ listofdecorations: [...state.listofdecorations, newDeco] }));
  },

  removeDecoration: (id) => {
    set((state) => ({
      listofdecorations: state.listofdecorations.filter((d) => d.id !== id),
    }));
  },

  updateDecorationPosition: (id, x, y) => {
    set((state) => ({
      listofdecorations: state.listofdecorations.map((d) =>
        d.id === id ? { ...d, x, y } : d
      ),
    }));
  },

  updateDecorationSelection: (id) => {
    set((state) => ({
      listofdecorations: state.listofdecorations.map((d) => ({
        ...d,
        isSelected: d.id === id,
      })),
    }));
  },

  // ─── API Actions ────────────────────────────────────────────────────────────
  fetchFloors: async () => {
    try {
      const res = await axiosClient.get(API_ENDPOINTS.RESTAURANT.GET_ALL_FLOORS);
      if (res.data?.success && res.data?.floors) {
        const mappedFloors: FloorModel[] = res.data.floors.map((f: any) => ({
          floorId: Number(f.id || 0),
          floorName: f.name || "",
          floorNo: String(f.floor_no || ""),
          noOfTable: parseInt(f.tables_capacity || f.tables || "0") || 0,
          storeid: Number(f.store_id || 0),
        }));
        set({ listOfFloors: mappedFloors });
        return mappedFloors;
      }
      return [];
    } catch (e) {
      console.error("Fetch floors error:", e);
      return [];
    }
  },

  fetchFloorDetails: async (id) => {
    try {
      const res = await axiosClient.get(`${API_ENDPOINTS.RESTAURANT.SHOW_FLOOR}${id}`, {
        params: { id },
      });

      if (res.data) {
        set({ lastResponseKeys: Object.keys(res.data).join(", ") });
      }

      if (res.data?.success) {
        const data = res.data;
        const rawFloor = data.floor;
        const source = Array.isArray(rawFloor) ? rawFloor[0] : rawFloor || data;

        const resTables = source.tables || data.tables || source.table || [];
        const resDecorations =
          source.decroation || source.decoration || source.decorations ||
          data.decroation || data.decoration || data.decorations || [];

        const mappedTables: TableModel[] = resTables.map((t: any) => ({
          tableId: Number(t.id || 0),
          // Coerce to string to prevent null/undefined crashing <Text> components
          tableName: String(t.name || `Table ${t.id || '?'}`),
          floorid: Number(t.floor_id || source.id || id || 0),
          x: Number(t.x_axis || 0),
          y: Number(t.y_axis || 0),
          width: Number(t.width || 100),
          height: Number(t.height || 60),
          isRounded: t.is_round === 1 || t.is_round === true,
          rotation: Number(t.rotation || 0),
          chairsCount: Number(t.table_chairs || 0),
          listofChairs: (() => {
            try {
              return typeof t.list_of_chairs === "string"
                ? JSON.parse(t.list_of_chairs)
                : Array.isArray(t.list_of_chairs)
                  ? t.list_of_chairs
                  : [0, 0, 0, 0];
            } catch {
              return [0, 0, 0, 0];
            }
          })(),
          isSelected: false,
        }));

        const mappedDecorations: DecorationModel[] = resDecorations.map((d: any) => ({
          id: Number(d.id || 0),
          floor: Number(d.floor_id || source.id || id || 0),
          // Coerce to string to prevent null/undefined crashing <Text> components
          title: String(d.name || 'Decoration'),
          x: Number(d.x_axis || 0),
          y: Number(d.y_axis || 0),
          width: 35,
          height: 35,
          isSelected: false,
        }));

        const state = get();
        const otherTables = state.listOfTables.filter((t) => Number(t.floorid) !== Number(id));
        const otherDecos = state.listofdecorations.filter((d) => Number(d.floor) !== Number(id));
        set({
          listOfTables: [...otherTables, ...mappedTables],
          listofdecorations: [...otherDecos, ...mappedDecorations],
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Fetch floor details error:", e);
      return false;
    }
  },

  saveFloorLayout: async () => {
    try {
      const state = get();

      // ─── PHASE 1: Save floors only ───────────────────────────────────────────
      // We always save floors first so the backend commits them before we
      // reference their IDs in tables/decorations. This prevents the FK
      // constraint violation caused by the backend processing tables before
      // floors are fully inserted/committed.
      const floorsOnlyPayload = {
        floors: state.listOfFloors.map((f) => ({
          id: f.floorId > 1_000_000_000 ? 0 : f.floorId,
          name: f.floorName,
          floor_no: f.floorNo,
          tables_capacity: (f.noOfTable || 10).toString(),
          store_id: f.storeid || 1,
          remarks: "",
        })),
        // Empty arrays signal the backend to keep existing records unchanged
        tables: [],
        decorations: [],
        decroation: [],
      };

      const phase1Res = await axiosClient.post(API_ENDPOINTS.RESTAURANT.UPDATE_FLOOR, floorsOnlyPayload);

      if (!phase1Res.data?.success) {
        const errMsg =
          phase1Res.data?.message ||
          phase1Res.data?.error ||
          (phase1Res.data?.errors
            ? Object.values(phase1Res.data.errors).flat().join(", ")
            : "Failed to save floors");
        return { success: false, message: errMsg };
      }

      // ─── Map server-returned floor IDs ───────────────────────────────────────
      // The backend returns the committed floor records with real IDs.
      const phase1Data = phase1Res.data;
      const rawFloor = phase1Data.floor;
      const resFloors: any[] = Array.isArray(phase1Data.floors)
        ? phase1Data.floors
        : rawFloor
          ? Array.isArray(rawFloor) ? rawFloor : [rawFloor]
          : [];

      // Build a map from our local floorNo -> server floorId
      const serverFloors: FloorModel[] = resFloors.map((f: any) => ({
        floorId: Number(f.id || 0),
        floorName: String(f.name || ""),
        floorNo: String(f.floor_no || ""),
        noOfTable: Number(f.tables_capacity || 0),
        storeid: Number(f.store_id || 0),
      }));

      // Use server list if returned, otherwise keep local list (no change scenario)
      const confirmedFloors = serverFloors.length > 0 ? serverFloors : state.listOfFloors;

      // Map local floor IDs to server-confirmed IDs for tables and decorations
      const resolveFloorId = (localFloorId: number): number => {
        const localFloor = state.listOfFloors.find(f => f.floorId === localFloorId);
        if (!localFloor) return localFloorId;
        const matched = confirmedFloors.find(f => f.floorNo === localFloor.floorNo);
        return matched ? matched.floorId : localFloorId;
      };

      // ─── PHASE 2: Save tables and decorations ────────────────────────────────
      // Now that floors are confirmed in the DB, we can safely reference their IDs.
      const tablesPayload = state.listOfTables
        .filter((t) => confirmedFloors.some((f) => f.floorNo === state.listOfFloors.find(lf => lf.floorId === t.floorid)?.floorNo))
        .map((t) => ({
          id: t.tableId > 1_000_000_000 ? 0 : t.tableId,
          floor_id: resolveFloorId(t.floorid), // Always a committed server ID
          name: t.tableName,
          table_chairs: (t.chairsCount || 0).toString(),
          x_axis: t.x.toString(),
          y_axis: t.y.toString(),
          height: Math.round(t.height || 80).toString(),
          width: Math.round(t.width || 80).toString(),
          is_round: t.isRounded ? 1 : 0,
          rotation: t.rotation.toString(),
          list_of_chairs: t.listofChairs,
          status: 1,
          remarks: "",
        }));

      const decoPayload = state.listofdecorations
        .filter((d) => confirmedFloors.some((f) => f.floorNo === state.listOfFloors.find(lf => lf.floorId === d.floor)?.floorNo))
        .map((d) => ({
          id: d.id > 1_000_000_000 ? 0 : d.id,
          floor_id: resolveFloorId(d.floor), // Always a committed server ID
          name: d.title,
          x_axis: d.x.toString(),
          y_axis: d.y.toString(),
          remarks: "",
        }));

      const fullPayload = {
        floors: confirmedFloors.map((f) => ({
          id: f.floorId,
          name: f.floorName,
          floor_no: f.floorNo,
          tables_capacity: (f.noOfTable || 10).toString(),
          store_id: f.storeid || 1,
          remarks: "",
        })),
        tables: tablesPayload,
        decorations: decoPayload,
        decroation: decoPayload,
      };

      const phase2Res = await axiosClient.post(API_ENDPOINTS.RESTAURANT.UPDATE_FLOOR, fullPayload);

      // ─── Update local state with confirmed server data ────────────────────────
      if (phase2Res.data?.success) {
        const updatedTables = state.listOfTables.map(table => ({
          ...table,
          floorid: resolveFloorId(table.floorid),
        }));
        const updatedDecos = state.listofdecorations.map(deco => ({
          ...deco,
          floor: resolveFloorId(deco.floor),
        }));

        set({
          listOfFloors: confirmedFloors,
          listOfTables: updatedTables,
          listofdecorations: updatedDecos,
          deletedFloorIds: [], // Clear pending deletions — synced
        });

        if (state.currentFloor) {
          const updatedCurrent = confirmedFloors.find(
            (f) => f.floorNo === state.currentFloor?.floorNo
          );
          if (updatedCurrent) set({ currentFloor: updatedCurrent });
        }
      }

      return {
        success: !!phase2Res.data?.success,
        message:
          phase2Res.data?.message ||
          phase2Res.data?.error ||
          (phase2Res.data?.errors
            ? Object.values(phase2Res.data.errors).flat().join(", ")
            : "Unknown server error"),
      };
    } catch (e: any) {
      console.error("Save floor layout error:", e);
      const serverError = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join(", ")
        : null;
      return {
        success: false,
        message:
          serverError ||
          e.response?.data?.message ||
          e.response?.data?.error ||
          e.message ||
          "Failed to save",
      };
    }
  },
}));
