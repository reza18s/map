import { Tooltip } from "@nextui-org/react";
import React from "react";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { useModal } from "@/store/useModal";
import { IPoint } from "@/types";
import { DeletePointModal } from "../modals/deletePointModal";
import { EditIcon, Trash2 } from "lucide-react";

export const PointAction = ({ data }: { data: IPoint }) => {
  const setOpen = useModal((state) => state.setOpen);
  return (
    <div className="relative flex items-center gap-4">
      <Tooltip content="edit point">
        <button
          onClick={() =>
            setOpen(
              <Modals title="edit point">
                <PointForm type="edit"></PointForm>
              </Modals>,
              { point: data },
            )
          }
          className="cursor-pointer text-lg text-default-400 active:opacity-50"
        >
          <EditIcon />
        </button>
      </Tooltip>

      <Tooltip color="danger" content="delete point">
        <button
          onClick={() =>
            setOpen(<DeletePointModal data={data}></DeletePointModal>)
          }
          className="cursor-pointer text-lg text-danger active:opacity-50"
        >
          <Trash2 />
        </button>
      </Tooltip>
    </div>
  );
};
