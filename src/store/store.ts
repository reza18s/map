// File: src/store/store.ts
import { getData, postData } from "@/services/API";
import { IPoint, IPolygon, ISettings } from "@/types";
import { create } from "zustand";
import L from "leaflet";

interface dataType {
  map: L.Map | null;
  isLoading: boolean;
  points: IPoint[];
  polygons: IPolygon[]; // New state for polygons
  settings?: ISettings;
  addPointModal: boolean;
  showPointList: boolean;
}

interface storeAction {
  setAddPointModal: (value: boolean) => void;
  setShowPointList: (value: boolean) => void;
  setPoints: (points: IPoint[]) => void;
  setPolygons: (polygons: IPolygon[]) => void; // New setter for polygons
  getSettings: () => void;
  getAllPoints: () => void;
  getAllPolygons: () => void; // New method to fetch polygons
  setIsLoading: (state: (() => boolean) | boolean) => void;
  setMap: (state: (() => L.Map | null) | (L.Map | null)) => void;
}

const initialData: dataType = {
  map: null,
  isLoading: false,
  addPointModal: false,
  points: [],
  polygons: [], // Initialize polygons as an empty array
  showPointList: false,
};

export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set) => ({
  ...initialData,

  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),

  // Set the points array
  setPoints: (points) => set(() => ({ points })),

  // Set the polygons array
  setPolygons: (polygons) => set(() => ({ polygons })),

  // Fetch settings (similar to previous implementation)
  getSettings: () => {
    set({ isLoading: true });
    getData("/api/settings", {}).then((res) => {
      set({ settings: res.data, isLoading: false });
    });
  },

  // Fetch all points
  getAllPoints: () => {
    set({ isLoading: true });
    getData("/api/points", {})
      .then((res) => {
        set({ points: res.data, isLoading: false });
      })
      .catch((error) => {
        console.error("Error fetching points:", error);
        set({ isLoading: false });
      });
  },

  // Fetch all polygons
  getAllPolygons: () => {
    set({ isLoading: true });
    getData("/api/polygons", {}).then((res) => {
      set({ polygons: res.data, isLoading: false });
    });
  },

  // Toggle the visibility of a polygon (flag update)
  togglePolygonVisibility: (id: string, currentFlag: number) => {
    set({ isLoading: true });
    postData("/api/polygons/update-flag", {
      id,
      flag: currentFlag === 1 ? 0 : 1,
    }).then(() => {
      // Re-fetch polygons after updating visibility
      getData("/api/polygons", {}).then((res) => {
        set({ polygons: res.data, isLoading: false });
      });
    });
  },

  // Set the loading state
  setIsLoading: (state) => {
    if (typeof state == "boolean") {
      set({ isLoading: state });
    }
    if (typeof state == "function") {
      set({ isLoading: state() });
    }
  },

  // Set the map object
  setMap: (state) => {
    if (typeof state == "function") {
      set({ map: state() });
    } else {
      set({ map: state });
    }
  },
}));
