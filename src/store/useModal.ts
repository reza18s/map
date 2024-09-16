import { IPoint } from "@/types";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalData = {
  point?: IPoint;
};
interface IModal {
  isLoading: boolean;
  data: ModalData;
  isOpen: boolean;
  modal: React.ReactNode;
}
export type Actions = {
  setOpen: (modal: React.ReactNode, data?: ModalData) => void;
  setClose: () => void;
  setIsLoading: (state: (() => boolean) | boolean) => void;
};
export type Store = IModal & Actions;
const defaultValues: IModal = {
  isLoading: false,
  data: {},
  modal: null,
  isOpen: false,
};
export const useModal = create<Store>()(
  devtools((set, get) => ({
    ...defaultValues,
    setOpen: (modal, data) => {
      set({ modal, isOpen: true, data: { ...get().data, ...data } });
    },
    setClose: () => {
      set(defaultValues);
    },
    setIsLoading: (state) => {
      if (typeof state == "boolean") {
        return set({ isLoading: state });
      }
      return set({ isLoading: state() });
    },
  })),
);
