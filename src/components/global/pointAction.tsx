import { Tooltip } from "@nextui-org/react";
import React from "react";
import { EditIcon } from "../map/EditIcon";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { useModal } from "@/store/useModal";
import { IPoint } from "@/types";

export const PointAction = ({ data }: { data: IPoint }) => {
  const setOpen = useModal((state) => state.setOpen);
  return (
    <div className="relative flex items-center gap-4">
      <Tooltip content="edit point">
        <button
          onClick={() =>
            setOpen(
              <Modals>
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

      {/* <Tooltip color="danger" content="delete point">
        <button
          onClick={() => {
            setDeleteModal(true);
            setPointId(point._id);
          }}
          className="cursor-pointer text-lg text-danger active:opacity-50"
        >
          <DeleteIcon />
        </button>
      </Tooltip> */}
    </div>
  );
};
