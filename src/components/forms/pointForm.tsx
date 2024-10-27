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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Label } from "../ui/label";
import { PointIcon } from "../map/PointIcon";
const OPTIONS: Option[] = [
  { label: "frequency", value: "frequency" },
  { label: "angle", value: "angle" },
  { label: "status", value: "status" },
  { label: "bandwidth", value: "bandwidth" },
];
export const PointForm = ({ type }: { type?: "edit" | "create" }) => {
  const { data, setIsLoading, isLoading, setClose } = useModal(
    (state) => state,
  );
  const getAllPoints = useAppStore((state) => state.getAllPoints);
  const settings = useAppStore((state) => state.settings);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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
      ip: data.point?.ip || "127.0.0.1",
      port: data.point?.port || 5000,
      requireData: data.point?.requireData || [],
      level: data.point?.level || 0,
    },
  });

  const submitHandler = (newPoint: z.infer<typeof pointObject>) => {
    if (type == "edit") {
      setIsLoading(true);
      putData("/api/points/", {
        ...newPoint,
        id: data.point?._id,
      })
        .then(() => {
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
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      console.log(settings);
      setIsLoading(true);
      postData("/api/points", { ...newPoint })
        .then(() => {
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
        })
        .catch(() => {
          setIsLoading(false);
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
            {...register("level", { required: true, valueAsNumber: true })}
          />{" "}
          <Input
            isRequired
            label="ip"
            labelPlacement="outside"
            className="text-lg font-semibold"
            placeholder="Enter point ip"
            isInvalid={!!errors.ip}
            errorMessage={errors.ip ? errors.ip.message : ""}
            {...register("ip", { required: true })}
          />
          <Input
            isRequired
            label="port"
            labelPlacement="outside"
            className="text-lg font-semibold"
            placeholder="Enter point port"
            isInvalid={!!errors.port}
            errorMessage={errors.port ? errors.port.message : ""}
            {...register("port", { required: true, valueAsNumber: true })}
          />
          <MultipleSelector
            defaultOptions={OPTIONS}
            placeholder="choose item for point"
            className="bg-white"
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
            value={getValues("requireData").map((el) => ({
              label: el,
              value: el,
            }))}
            onChange={(e) => {
              const data = e.map((e) => e.value);
              setValue("requireData", data);
            }}
          />
          <Select
            label="point type"
            placeholder="Select an icon"
            className="text-lg font-semibold "
            isRequired
            isInvalid={!!errors.iconType}
            errorMessage={errors.iconType ? errors.iconType.message : ""}
            {...register("iconType", { required: true })}
          >
            {PointIcon.map((val) => (
              <SelectItem key={val.name} value={val.name}>
                {val.name}
              </SelectItem>
            ))}
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
