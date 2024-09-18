"use client";
import React, { useEffect } from "react";
import { Modals } from ".";
import { ModalBody, ModalFooter, Spinner } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
export const DownloadModal = ({
  total,
  progress,
}: {
  total: number;
  progress: number;
}) => {
  const setClose = useModal((state) => state.setClose);
  useEffect(() => {
    if (total == progress) {
      setClose();
    }
  }, [total, progress]);
  return (
    <Modals title={"delete point"}>
      <ModalBody>
        <div className="flex w-full items-center justify-between gap-2 text-sm">
          <span>Total Tiles : {total}</span>
          <span>Downloaded Tiles : {progress}</span>

          {/* <div className="h-5 w-full rounded-full bg-gray-200">
            <div
              style={{ width: `${total / progress}%` }}
              className="flex h-full items-center justify-center rounded-full bg-indigo-600 text-xs text-white"
            >
              {progress}%
            </div>
          </div> */}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex w-full justify-center gap-4">
          <Spinner size="sm" label="Please wait..." />
        </div>
      </ModalFooter>
    </Modals>
  );
};
