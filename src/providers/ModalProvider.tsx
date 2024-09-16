"use client";
import React from "react";
import { useModal } from "@/store/useModal";

export const ModalProvider = () => {
  const Model = useModal((state) => state.modal);
  return <>{Model}</>;
};
