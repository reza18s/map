import { postData } from "@/services/API";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { pointObject } from "@/validator";
import { Button, Input, ModalBody, ModalFooter } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
export const PointForm = ({ type }: { type?: "edit" | "create" }) => {
  const { setClose, data } = useModal((state) => state);
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
  const [Loading, setLoading] = useState(false);

  const submitHandler = (newPoint: z.infer<typeof pointObject>) => {
    if (type == "edit") {
      setLoading(true);
      postData("/api/points/update-point", {
        ...newPoint,
        id: data.point?._id,
      }).then(() => {
        setLoading(false);
        // getAllPoints();
        reset({ name: "", lat: 0, lng: 0, frequency: 0 });
      });
    } else {
      setLoading(true);
      postData("/api/points", { ...newPoint }).then(() => {
        // getAllPoints();
        setLoading(false);
        reset({ name: "", lat: 0, lng: 0, frequency: 0 });
      });
    }
  };
  return (
    <>
      <ModalBody>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit((x) => submitHandler(x))}
        >
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            placeholder="Enter point name"
            isInvalid={!!errors.name}
            errorMessage="name is required"
            {...register("name", { required: true })}
          />

          <Input
            isRequired
            label="Lat"
            labelPlacement="outside"
            placeholder="Enter point lat"
            isInvalid={!!errors.lat}
            errorMessage="lat is required"
            {...register("lat", { required: true })}
          />

          <Input
            isRequired
            label="Lng"
            labelPlacement="outside"
            placeholder="Enter point lng"
            isInvalid={!!errors.lng}
            errorMessage="lng is required"
            {...register("lng", { required: true })}
          />

          <Input
            isRequired
            label="Frequency"
            labelPlacement="outside"
            placeholder="Enter point frequency"
            isInvalid={!!errors.frequency}
            errorMessage="frequency is required"
            {...register("frequency", { required: true })}
          />
        </form>
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
            isLoading={Loading}
            variant="shadow"
            className="bg-green-600 text-white shadow-green-200"
            type="submit"
          >
            Add point
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};
