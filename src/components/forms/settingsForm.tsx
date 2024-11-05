"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, ModalBody, ModalFooter } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
import { postData } from "@/services/API";
import { useAppStore } from "@/store/store";
import { settingsObject } from "@/validator";
export const SettingsForm = () => {
  const { setIsLoading, isLoading, setClose } = useModal((state) => state);
  const settings = useAppStore((state) => state.settings);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof settingsObject>>({
    resolver: zodResolver(settingsObject),
    mode: "onBlur",
    defaultValues: {
      lat_settings: settings?.lat || 35.694523130867424,
      lng_settings: settings?.lng || 51.30922197948697,
      zoom: settings?.zoom || 11,
      frequency: settings?.frequency,
    },
  });
  const submitHandler = async (data: z.infer<typeof settingsObject>) => {
    setIsLoading(true);
    postData("/api/settings", {
      lat: data.lat_settings,
      lng: data.lng_settings,
      zoom: data.zoom || 11,
      frequency: data.frequency,
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit((x) => submitHandler(x))}
    >
      <ModalBody>
        <div className="flex w-full flex-col gap-4">
          <Input
            isRequired
            label="Lat"
            labelPlacement="outside"
            placeholder="Enter point lat"
            isInvalid={!!errors.lat_settings}
            errorMessage={
              errors.lat_settings ? errors.lat_settings.message : ""
            }
            {...register("lat_settings", {
              required: true,
              valueAsNumber: true,
            })}
          />

          <Input
            isRequired
            label="Lng"
            labelPlacement="outside"
            placeholder="Enter point lng"
            isInvalid={!!errors.lng_settings}
            errorMessage={
              errors.lng_settings ? errors.lng_settings.message : ""
            }
            {...register("lng_settings", {
              required: true,
              valueAsNumber: true,
            })}
          />

          <Input
            isRequired
            label="Zoom"
            labelPlacement="outside"
            placeholder="Enter map zoom"
            isInvalid={!!errors.zoom}
            errorMessage={errors.zoom ? errors.zoom.message : ""}
            {...register("zoom", { required: true, valueAsNumber: true })}
          />
          <Input
            isRequired
            label="frequency"
            labelPlacement="outside"
            placeholder="Enter map frequency"
            isInvalid={!!errors.frequency}
            errorMessage={errors.frequency ? errors.frequency.message : ""}
            {...register("frequency", { required: true, valueAsNumber: true })}
          />
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
            Save
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
};
