"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { settingsObject } from "@/validator";
import { Button, Input, ModalBody, ModalFooter } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
import { postData } from "@/services/API";
export const SettingsForm = () => {
  const { setIsLoading, isLoading, setClose } = useModal((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof settingsObject>>({
    resolver: zodResolver(settingsObject),

    defaultValues: {
      lat_settings: 0,
      lng_settings: 0,
      zoom: 11,
    },
  });

  const submitHandler = (data: z.infer<typeof settingsObject>) => {
    setIsLoading(true);
    postData("/api/settings", {
      lat: data.lat_settings,
      lng: data.lng_settings,
      zoom: data.zoom,
    })
      .then(() => {
        setIsLoading(false);
        window.location.reload();
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
            errorMessage="lat is required"
            {...register("lat_settings", { required: true })}
          />

          <Input
            isRequired
            label="Lng"
            labelPlacement="outside"
            placeholder="Enter point lng"
            isInvalid={!!errors.lng_settings}
            errorMessage="lng is required"
            {...register("lng_settings", { required: true })}
          />

          <Input
            isRequired
            label="Zoom"
            labelPlacement="outside"
            placeholder="Enter map zoom"
            isInvalid={!!errors.zoom}
            errorMessage="zoom is required"
            {...register("zoom", { required: true })}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex w-full justify-center gap-4">
          <Button color="danger" variant="light" onClick={() => setClose()}>
            Close
          </Button>
          <Button
            isLoading={isLoading}
            variant="shadow"
            className="bg-green-600 text-white shadow-green-200"
            onClick={handleSubmit(submitHandler)}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
};
