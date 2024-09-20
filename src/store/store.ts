import { getData, postData } from "@/services/API";
import { ILine, IPoint, IPolygon, ISettings } from "@/types";
import { create } from "zustand";
import L from "leaflet";

interface dataType {
  map: L.Map | null;
  isLoading: boolean;
  points: IPoint[];
  polygons: IPolygon[]; // State for polygons
  lines: ILine[]; // New state for lines
  settings?: ISettings;
  addPointModal: boolean;
  showPointList: boolean;
}

interface storeAction {
  setAddPointModal: (value: boolean) => void;
  setShowPointList: (value: boolean) => void;
  setPoints: (points: IPoint[]) => void;
  setPolygons: (polygons: IPolygon[]) => void; // Setter for polygons
  setLines: (lines: ILine[]) => void; // New setter for lines
  addLine: (line: ILine) => void; // New action to add a line
  getSettings: () => void;
  getAllPoints: () => void;
  refreshAllData: () => void;
  getAllPolygons: () => Promise<IPolygon[]>;
  getAllLines: () => Promise<ILine[]>; // Fetch all lines
  setIsLoading: (state: (() => boolean) | boolean) => void;
  setMap: (state: (() => L.Map | null) | (L.Map | null)) => void;
}

const initialData: dataType = {
  map: null,
  isLoading: false,
  addPointModal: false,
  points: [],
  polygons: [], // Initialize polygons as an empty array
  lines: [], // Initialize lines as an empty array
  showPointList: false,
};

export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set, get) => ({
  ...initialData,

  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),

  // Set the points array
  setPoints: (points) => set(() => ({ points })),

  // Set the polygons array
  setPolygons: (polygons) => set(() => ({ polygons })),

  // Set the lines array
  setLines: (lines) => set(() => ({ lines })),

  // Add a new line
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),

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
  getAllPolygons: async () => {
    set({ isLoading: true });
    const res = await getData("/api/polygons", {});
    set({ polygons: res.data, isLoading: false });
    return res.data;
  },

  // Fetch all lines
  getAllLines: async () => {
    set({ isLoading: true });
    const res = await getData("/api/lines", {});
    set({ lines: res.data, isLoading: false });
    return res.data;
  },

  // Set the loading state
  setIsLoading: (state) => {
    if (typeof state == "boolean") {
      set({ isLoading: state });
    } else if (typeof state == "function") {
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
  refreshAllData: () => {
    get().getAllLines();
    get().getAllPoints();
    get().getAllPolygons();
    get().getSettings();
  },
}));
