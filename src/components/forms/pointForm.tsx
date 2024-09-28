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
  Switch,
} from "@nextui-org/react";
import { useModal } from "@/store/useModal";
import { useAppStore } from "@/store/store";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

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
      active: data.point?.active || false,
      connect: data.point?.connect || false,
      status: data.point?.status || false,
      level: data.point?.level || 0,
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
            className="text-lg font-semibold"
            labelPlacement="outside"
            placeholder="Enter point name"
            isInvalid={!!errors.name}
            errorMessage={errors.name ? errors.name.message : ""}
            {...register("name", { required: true })}
          />
          <Input
            isRequired
            label="Lat"
            className="text-lg font-semibold"
            labelPlacement="outside"
            placeholder="Enter point lat"
            isInvalid={!!errors.lat}
            errorMessage={errors.lat ? errors.lat.message : ""}
            {...register("lat", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="Lng"
            className="text-lg font-semibold"
            labelPlacement="outside"
            placeholder="Enter point lng"
            isInvalid={!!errors.lng}
            errorMessage={errors.lng ? errors.lng.message : ""}
            {...register("lng", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="Frequency"
            className="text-lg font-semibold"
            labelPlacement="outside"
            placeholder="Enter point frequency"
            isInvalid={!!errors.frequency}
            errorMessage={errors.frequency ? errors.frequency.message : ""}
            {...register("frequency", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="Level"
            labelPlacement="outside"
            className="text-lg font-semibold"
            placeholder="Enter point Level"
            isInvalid={!!errors.level}
            errorMessage={errors.level ? errors.level.message : ""}
            {...register("level", { required: true })}
          />

          {/* Select for Icon Type */}
          <Select
            label="Choose Icon"
            placeholder="Select an icon"
            className="text-lg font-semibold "
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
            <SelectItem key="human" value="human">
              human
            </SelectItem>
            <SelectItem key="helicopter" value="helicopter">
              helicopter
            </SelectItem>
            <SelectItem key="train" value="train">
              train
            </SelectItem>
          </Select>
          <div className="flex items-center  gap-2">
            <Label htmlFor="status" className="text-sm font-semibold">
              status:
            </Label>
            <Switch
              id="status"
              {...register("status", { required: true })}
            ></Switch>
          </div>

          <div className="flex items-center  gap-2">
            <Label htmlFor="active" className="text-sm font-semibold">
              active:
            </Label>
            <Switch
              id="active"
              {...register("active", { required: true })}
            ></Switch>
          </div>
          <div className="flex items-center  gap-2">
            <Label htmlFor="connect" className="text-sm font-semibold">
              connect:
            </Label>
            <Switch
              id="connect"
              {...register("connect", { required: true })}
            ></Switch>
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
