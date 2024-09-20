"use client";

import { postData, putData } from "@/services/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { pointObject } from "@/validator";
import { Button, Input, ModalBody, ModalFooter } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
import { useAppStore } from "@/store/store";
export const PointForm = ({ type }: { type?: "edit" | "create" }) => {
  const { data, setIsLoading, isLoading, setClose } = useModal(
    (state) => state,
  );
  const getAllPoints = useAppStore((state) => state.getAllPoints);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof pointObject>>({
    resolver: zodResolver(pointObject),

    defaultValues: {
      name: data.point?.name || "",
      lat: data.point?.lat || 0,
      lng: data.point?.lng || 0,
      frequency: data.point?.frequency || 0,
    },
  });

  const submitHandler = (newPoint: z.infer<typeof pointObject>) => {
    if (type == "edit") {
      setIsLoading(true);
      putData("/api/points/", {
        ...newPoint,
        id: data.point?._id,
      }).then(() => {
        setIsLoading(false);
        getAllPoints();
        reset({ name: "", lat: 0, lng: 0, frequency: 0 });
        setClose();
      });
    } else {
      setIsLoading(true);
      postData("/api/points", { ...newPoint }).then(() => {
        getAllPoints();
        setIsLoading(false);

        reset({ name: "", lat: 0, lng: 0, frequency: 0 });
        setClose();
      });
    }
  };
  return (
    <>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit((x) => submitHandler(x))}
      >
        <ModalBody>
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            placeholder="Enter point name"
            isInvalid={!!errors.name}
            errorMessage={errors.name ? errors.name.message : ""}
            {...register("name", { required: true })}
          />

          <Input
            isRequired
            label="Lat"
            labelPlacement="outside"
            placeholder="Enter point lat"
            isInvalid={!!errors.lat}
            errorMessage={errors.lat ? errors.lat.message : ""}
            {...register("lat", { required: true, valueAsNumber: true })}
          />

          <Input
            isRequired
            label="Lng"
            labelPlacement="outside"
            placeholder="Enter point lng"
            isInvalid={!!errors.lng}
            errorMessage={errors.lng ? errors.lng.message : ""}
            {...register("lng", { required: true, valueAsNumber: true })}
          />

          <Input
            isRequired
            label="Frequency"
            labelPlacement="outside"
            placeholder="Enter point frequency"
            isInvalid={!!errors.frequency}
            errorMessage={errors.frequency ? errors.frequency.message : ""}
            {...register("frequency", { required: true, valueAsNumber: true })}
          />
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
              className="bg-green-600 text-white shadow-green-200"
              type="submit"
            >
              {type === "edit" ? "edit point" : "Add point"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </>
  );
};
