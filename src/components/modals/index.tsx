"use client";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { useModal } from "@/store/useModal";
export function Modals({ children }: { children: React.ReactNode }) {
  const { isOpen, setClose } = useModal((state) => state);
  return (
    <Modal
      classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
      isOpen={isOpen}
      onClose={() => setClose()}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add new point
            </ModalHeader>
            {children}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
