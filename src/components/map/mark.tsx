"use client";

import { EditIcon, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Modals } from "../modals";
import { DeletePointModal } from "../modals/deletePointModal";
import { PointForm } from "../forms/pointForm";
import { postData } from "@/services/API";
import { IPoint } from "@/types";
import { getPointIcon } from "./PointIcon"; // Adjusted import
import { useAppStore } from "@/store/store";
import { useModal } from "@/store/useModal";
import { startPointWorker } from "@/helper/workerManager";

import L from "leaflet";
const currentLine: { [key: string]: L.Polyline<any> } = {};
export const Mark = ({
  point,
  setPointLabel,
}: {
  point: IPoint;
  setPointLabel: React.Dispatch<React.SetStateAction<Partial<IPoint>>>;
}) => {
  const { getAllPoints, map } = useAppStore((state) => state);
  const { setOpen } = useModal((state) => state);
  const changeStatusHandler = (id: string) => {
    postData("/api/points/change-status", { id }).then(() => {
      getAllPoints();
    });
  };

  // Function to calculate the new point based on the angle and distance
  const calculateEndpoint = (
    lat: number,
    lng: number,
    angle: number,
    distance: number = 1000, // 1 km
  ): [number, number] => {
    const R = 6371000; // Radius of the Earth in meters
    const angularDistance = distance / R; // Angular distance in radians
    const angleRad = (angle * Math.PI) / 180; // Convert the angle to radians

    const newLat = Math.asin(
      Math.sin((lat * Math.PI) / 180) * Math.cos(angularDistance) +
        Math.cos((lat * Math.PI) / 180) *
          Math.sin(angularDistance) *
          Math.cos(angleRad),
    );

    const newLng =
      ((lng * Math.PI) / 180 +
        Math.atan2(
          Math.sin(angleRad) *
            Math.sin(angularDistance) *
            Math.cos((lat * Math.PI) / 180),
          Math.cos(angularDistance) -
            Math.sin((lat * Math.PI) / 180) * Math.sin(newLat),
        )) *
      (180 / Math.PI);

    return [newLat * (180 / Math.PI), newLng];
  };

  useEffect(() => {
    if (point.connect) {
      startPointWorker(point._id, point.port, point.requireData);
    }
  }, [point.connect]);
  useEffect(() => {
    if (point.status) {
      if (currentLine[point._id]) {
        return;
      }
    } else if (currentLine[point._id]) {
      map?.removeLayer(currentLine[point._id]);
      delete currentLine[point._id];
    }
  }, [point]);
  return (
    <>
      {point.status && (
        <Marker
          key={point._id}
          icon={getPointIcon(point.iconType)} // Adjusted to pass correct icon type
          position={[point.lat, point.lng]}
          eventHandlers={{
            mouseover: () => {
              setPointLabel(point);
            },
            mouseout: () => {
              setPointLabel({});
            },
            click: () => {
              // Remove the existing line before adding a new one
              if (currentLine[point._id]) {
                return;
              }
              // Calculate the endpoint for the new line based on the point's angle
              const endPoint = calculateEndpoint(
                point.lat,
                point.lng,
                point.level,
              );

              // Create a new line from the point to the calculated endpoint
              currentLine[point._id] = L.polyline(
                [[point.lat, point.lng], endPoint],
                {
                  color: "blue",
                },
              ).addTo(map!);
            },
          }}
        >
          <Tooltip direction="bottom" offset={[0, 10]} permanent>
            {point.name}
          </Tooltip>
          <Popup>
            <div className="flex w-full flex-col gap-1">
              <span>name: {point.name}</span>
              <span>lat: {point.lat}</span>
              <span>lng: {point.lng}</span>
              <span>frequency: {point.frequency}</span>
              <span>status: {point.status}</span>

              <div className="mt-2 flex w-full items-center justify-center gap-3">
                <button
                  onClick={() =>
                    setOpen(
                      <Modals title="edit point">
                        <PointForm type="edit"></PointForm>
                      </Modals>,
                      { point },
                    )
                  }
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                >
                  <EditIcon />
                </button>

                <button
                  onClick={() => {
                    map?.removeLayer(currentLine[point._id]);
                    delete currentLine[point._id];
                    setOpen(
                      <DeletePointModal
                        data={point}
                        url="/api/points/del"
                      ></DeletePointModal>,
                    );
                  }}
                  className="cursor-pointer text-lg text-danger active:opacity-50"
                >
                  <Trash2 />
                </button>

                <button
                  onClick={() => changeStatusHandler(point._id)}
                  className="cursor-pointer text-lg text-warning active:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};
