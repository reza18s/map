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
  history: any[]; // Array to track history for undo
  future: any[]; // Array to track future for redo
}

interface storeAction {
  setAddPointModal: (value: boolean) => void;
  setShowPointList: (value: boolean) => void;
  setPoints: (points: IPoint[]) => void;
  setPolygons: (polygons: IPolygon[]) => void; // Setter for polygons
  setLines: (lines: ILine[]) => void; // Setter for lines
  addLine: (line: ILine) => void; // Action to add a line
  getSettings: () => void;
  getAllPoints: () => void;
  refreshAllData: () => void;
  getAllPolygons: () => Promise<IPolygon[]>;
  getAllLines: () => Promise<ILine[]>;
  setIsLoading: (state: (() => boolean) | boolean) => void;
  setMap: (state: (() => L.Map | null) | (L.Map | null)) => void;
  pushToHistory: (actionType: string, data: any) => void;
  undo: () => void;
  redo: () => void;
}

const initialData: dataType = {
  map: null,
  isLoading: false,
  addPointModal: false,
  points: [],
  polygons: [],
  lines: [],
  showPointList: false,
  history: [],
  future: [],
};

export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set, get) => ({
  ...initialData,

  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),

  setPoints: (points) => set(() => ({ points })),
  setPolygons: (polygons) => set(() => ({ polygons })),
  setLines: (lines) => set(() => ({ lines })),

  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),

  getSettings: () => {
    set({ isLoading: true });
    getData("/api/settings", {}).then((res) => {
      set({ settings: res.data, isLoading: false });
    });
  },

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

  getAllPolygons: async () => {
    set({ isLoading: true });
    const res = await getData("/api/polygons", {});
    set({ polygons: res.data, isLoading: false });
    return res.data;
  },

  getAllLines: async () => {
    set({ isLoading: true });
    const res = await getData("/api/lines", {});
    set({ lines: res.data, isLoading: false });
    return res.data;
  },

  setIsLoading: (state) => {
    if (typeof state == "boolean") {
      set({ isLoading: state });
    } else if (typeof state == "function") {
      set({ isLoading: state() });
    }
  },

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

  // Push state to history and reset future (for new actions)
  pushToHistory: (actionType: string, data: any) => {
    const { history } = get();
    set({
      history: [...history, { actionType, data }],
      future: [], // Reset future state when new action is performed
    });
  },

  // Undo: Revert the last action and store it in future
  undo: () => {
    console.log("fuck");
    const { history, future, setPolygons, setLines } = get();
    if (history.length === 0) {
      return;
    }

    const lastAction = history[history.length - 1];
    const updatedHistory = history.slice(0, -1);
    set({ history: updatedHistory, future: [lastAction, ...future] });

    switch (lastAction.actionType) {
      case "addPolygon":
        setPolygons(lastAction.data.previousPolygons);
        break;
      case "addLine":
        setLines(lastAction.data.previousLines);
        break;
      case "deletePolygon":
        setPolygons(lastAction.data.previousPolygons);
        break;
      case "deleteLine":
        setLines(lastAction.data.previousLines);
        break;
    }
  },

  // Redo: Reapply the last undone action
  redo: () => {
    const { future, history, setPolygons, setLines } = get();
    if (future.length === 0) {
      return;
    }

    const nextAction = future[0];
    const updatedFuture = future.slice(1);
    set({ future: updatedFuture, history: [...history, nextAction] });

    switch (nextAction.actionType) {
      case "addPolygon":
        setPolygons(nextAction.data.newPolygons);
        break;
      case "addLine":
        setLines(nextAction.data.newLines);
        break;
      case "deletePolygon":
        setPolygons(nextAction.data.newPolygons);
        break;
      case "deleteLine":
        setLines(nextAction.data.newLines);
        break;
    }
  },
}));
