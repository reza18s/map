"use client";
import React from "react";
import { Modals } from ".";
import { useModal } from "@/store/useModal";
import { deleteData } from "@/services/API";
import { IPoint } from "@/types";
import { Button, ModalBody, ModalFooter } from "@nextui-org/react";
import { useAppStore } from "@/store/store";

export const DeletePointModal = ({
  data,
  url = "/api/points",
}: {
  data: IPoint;
  url?: string;
}) => {
  const setClose = useModal((state) => state.setClose);
  const getAllPoints = useAppStore((state) => state.getAllPoints);
  const setIsLoading = useModal((state) => state.setIsLoading);
  const isLoading = useModal((state) => state.isLoading);
  const deletePointHandler = () => {
    setIsLoading(true);
    deleteData(url, { id: data._id }).then(() => {
      getAllPoints();
      setIsLoading(false);
      setClose();
    });
  };
  return (
    <Modals title={"delete point"}>
      <ModalBody>
        <div className="flex w-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>

          <span>Are you sure you want to delete this point?</span>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex w-full justify-center gap-4">
          <Button
            color="danger"
            variant="light"
            type="button"
            onClick={() => setClose()}
          >
            Close
          </Button>
          <Button
            isLoading={isLoading}
            variant="shadow"
            className="bg-red-500 text-white shadow-green-200"
            onClick={deletePointHandler}
          >
            remove point
          </Button>
        </div>
      </ModalFooter>
    </Modals>
  );
};
