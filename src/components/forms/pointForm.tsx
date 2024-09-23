"use client";

import { postData, putData } from "@/services/API";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { pointObject } from "@/validator";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
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
      iconType: data.point?.iconType || "car", // مقدار پیش‌فرض برای آیکون
      dFrequency: data.point?.frequency || 0,
      dAzimuth: data.point?.dAzimuth || 0,
      dLevel: data.point?.dLevel || 0,
      dQuality: data.point?.dQuality || 0,
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
        reset({
          name: "",
          lat: 0,
          lng: 0,
          frequency: 0,
          iconType: "car",
          dFrequency: 0,
          dAzimuth: 0,
          dLevel: 0,
          dQuality: 0,
        });
        setClose();
      });
    } else {
      setIsLoading(true);
      postData("/api/points", { ...newPoint }).then(() => {
        getAllPoints();
        setIsLoading(false);

        reset({
          name: "",
          lat: 0,
          lng: 0,
          frequency: 0,
          iconType: "car",
          dFrequency: 0,
          dAzimuth: 0,
          dLevel: 0,
          dQuality: 0,
        });
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
          <Input
            isRequired
            label="DFrequency"
            labelPlacement="outside"
            placeholder="Enter point dFrequency"
            isInvalid={!!errors.dFrequency}
            errorMessage={errors.dFrequency ? errors.dFrequency.message : ""}
            {...register("dFrequency", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="DAzimuth"
            labelPlacement="outside"
            placeholder="Enter point DAzimuth"
            isInvalid={!!errors.dAzimuth}
            errorMessage={errors.dAzimuth ? errors.dAzimuth.message : ""}
            {...register("dAzimuth", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="DLevel"
            labelPlacement="outside"
            placeholder="Enter point dLevel"
            isInvalid={!!errors.dLevel}
            errorMessage={errors.dLevel ? errors.dLevel.message : ""}
            {...register("dLevel", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="DQuality"
            labelPlacement="outside"
            placeholder="Enter point dQuality"
            isInvalid={!!errors.dQuality}
            errorMessage={errors.dQuality ? errors.dQuality.message : ""}
            {...register("dQuality", { required: true, valueAsNumber: true })}
          />
          {/* Select for Icon Type */}
          <Select
            label="Choose Icon"
            placeholder="Select an icon"
            isRequired
            isInvalid={!!errors.iconType}
            errorMessage={errors.iconType ? errors.iconType.message : ""}
            {...register("iconType", { required: true })}
          >
            <SelectItem key="car" value="car">
              Car
            </SelectItem>
            <SelectItem key="plane" value="plane">
              Plane
            </SelectItem>
            <SelectItem key="bus" value="bus">
              Bus
            </SelectItem>
          </Select>
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
              {type === "edit" ? "Edit Point" : "Add Point"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </>
  );
};
