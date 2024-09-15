import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { PointData } from "@/types";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

interface TableComponentProps {
  pointsList: PointData[];
  onEditClick: (point: PointData) => void;
  onDeleteClick: (id: string) => void;
}

const Tables: React.FC<TableComponentProps> = ({
  pointsList,
  onEditClick,
  onDeleteClick,
}) => {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Latitude", uid: "lat" },
    { name: "Longitude", uid: "lng" },
    { name: "Frequency", uid: "frequency" },
    { name: "Status", uid: "status" },
    { name: "Date", uid: "date" },
    { name: "Actions", uid: "actions" },
  ];

  const renderCell = (point: PointData, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div>
            <Tooltip content="Edit">
              <button onClick={() => onEditClick(point)}>
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button onClick={() => onDeleteClick(point._id)}>
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return <span>{point[columnKey as keyof PointData]}</span>;
    }
  };

  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="center">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={pointsList}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default Tables;
