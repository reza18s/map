"use client";
import React, { useState } from "react";
import {
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PointAction } from "../global/pointAction";
import { IPoint } from "@/types";
import { useAppStore } from "@/store/store";
import { postData } from "@/services/API";
const statusColorMap: { [key: string]: "success" | "danger" } = {
  active: "success",
  disable: "danger",
};
const columns = [
  { name: "id", uid: "id" },
  { name: "name", uid: "name" },
  { name: "lat", uid: "lat" },
  { name: "lng", uid: "lng" },
  { name: "frequency", uid: "frequency" },
  { name: "status", uid: "status" },
  { name: "time", uid: "time" },
  { name: "", uid: "action" },
];
export const Tables = () => {
  const { points, isLoading, getAllPoints } = useAppStore((state) => state);
  const [statusLoading, setStatusLoading] = useState(false);
  const changeStatusHandler = (id: string) => {
    setStatusLoading(true);
    postData("/api/points/change-status", { id }).then(() => {
      setStatusLoading(false);
      getAllPoints();
    });
  };

  const renderCell = (point: IPoint, columnKey: string, id: string) => {
    const cellValue = point[columnKey as keyof IPoint];

    switch (columnKey) {
      case "id":
        return <span>{id}</span>;
      case "name":
      case "lat":
      case "lng":
      case "frequency":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-bold text-gray-700">
              {point[columnKey]}
            </p>
          </div>
        );
      case "status":
        return (
          <button onClick={() => changeStatusHandler(point._id)}>
            <Chip
              className="capitalize"
              color={statusColorMap[point.status]}
              size="sm"
              variant="flat"
            >
              {statusLoading ? "wait..." : point.status}
            </Chip>
          </button>
        );
      case "time":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-bold capitalize text-gray-700">
              {new Date(point.date).toLocaleString()}
            </p>
          </div>
        );
      case "action":
        return <PointAction data={point}></PointAction>;
      default:
        return cellValue ? <span>{cellValue}</span> : null;
    }
  };
  return (
    <Table
      classNames={{ wrapper: "bg-transparent shadow-none rounded-none" }}
      className="max-h-fit overflow-scroll"
      aria-label="Example table with custom cells"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="center">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        loadingContent={<Spinner label="Loading..." />}
        isLoading={isLoading}
        items={points}
        emptyContent="doesn't exist any point  !"
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  //@ts-expect-error the
                  columnKey,
                  points.findIndex((p) => p._id === item._id) + 1,
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
