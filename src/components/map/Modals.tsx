import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FormData } from "@/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  loading: boolean;
  initialData?: FormData;
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Add or Edit Point</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            label="Name"
            {...register("name", { required: true })}
            errorMessage={errors.name ? "Name is required" : undefined}
          />
          <Input
            isRequired
            label="Latitude"
            {...register("lat", { required: true })}
            errorMessage={errors.lat ? "Latitude is required" : undefined}
          />
          <Input
            isRequired
            label="Longitude"
            {...register("lng", { required: true })}
            errorMessage={errors.lng ? "Longitude is required" : undefined}
          />
          <Input
            isRequired
            label="Frequency"
            {...register("frequency", { required: true })}
            errorMessage={
              errors.frequency ? "Frequency is required" : undefined
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>Close</Button>
          <Button onPress={handleSubmit(onSubmit)} isLoading={loading}>
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
