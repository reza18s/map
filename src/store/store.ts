import { getData } from "@/services/API";
import { IPoint, ISettings } from "@/types";
import { create } from "zustand";
import L from "leaflet";
interface dataType {
  map: L.Map | null;
  isLoading: boolean;
  points: IPoint[];
  settings?: ISettings;
  addPointModal: boolean;
  showPointList: boolean;
}
interface storeAction {
  setAddPointModal: (value: boolean) => void;
  setShowPointList: (value: boolean) => void;
  setPoints: (points: IPoint[]) => void;
  getSettings: () => void;
  getAllPoints: () => void;
  setIsLoading: (state: (() => boolean) | boolean) => void;
  setMap: (state: (() => L.Map | null) | (L.Map | null)) => void;
}
const initialData: dataType = {
  map: null,
  isLoading: false,
  addPointModal: false,
  points: [],
  showPointList: false,
};
export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set) => ({
  ...initialData,
  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),
  setPoints: (points) => set(() => ({ points })),
  getSettings: () => {
    set({ isLoading: true });
    getData("/api/settings", {}).then((res) => {
      set({ settings: res.data, isLoading: false });
    });
  },
  getAllPoints: () => {
    set({ isLoading: true });
    getData("/api/points", {}).then((res) => {
      set({ points: res.data, isLoading: false });
    });
  },
  setIsLoading: (state) => {
    if (typeof state == "boolean") {
      set({ isLoading: state });
    }
    if (typeof state == "function") {
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
}));
