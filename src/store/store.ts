import { create } from "zustand";

interface AppState {
  addPointModal: boolean;
  setAddPointModal: (value: boolean) => void;
  showPointList: boolean;
  setShowPointList: (value: boolean) => void;
  points: any[];
  setPoints: (points: any[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  addPointModal: false,
  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  showPointList: false,
  setShowPointList: (value) => set(() => ({ showPointList: value })),
  points: [],
  setPoints: (points) => set(() => ({ points })),
}));
