import { IPoint } from "@/types";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalData = {
  point?: IPoint;
};
interface IModal {
  data: ModalData;
  isOpen: boolean;
  modal: React.ReactNode;
}
export type Actions = {
  setOpen: (modal: React.ReactNode, data?: ModalData) => void;
  setClose: () => void;
};
export type Store = IModal & Actions;
const defaultValues: IModal = {
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
  })),
);
