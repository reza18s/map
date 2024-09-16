import { getData } from "@/services/API";
import { IPoint, ISettings } from "@/types";
import { create } from "zustand";

interface dataType {
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
}
const initialData: dataType = {
  isLoading: false,
  addPointModal: false,
  points: [],
  showPointList: false,
};
export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set, get) => ({
  ...initialData,
  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),
  setPoints: (points) => set(() => ({ points })),
  getSettings: () => {
    getData("/api/settings", {}).then((res) => {
      set({ settings: res.data });
    });
  },
  getAllPoints: () => {
    getData("/api/points", {}).then((res) => {
      set({ points: res.data });
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
}));
