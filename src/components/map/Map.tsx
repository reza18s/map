"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import { Spinner } from "@nextui-org/react";
import { useAppStore } from "@/store/store";
import { IPoint } from "@/types";
import { ModalProvider } from "@/providers/ModalProvider";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { Tables } from "./Table";
import { Toolbar } from "./toolbar";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DownloadModal } from "../modals/downloadModal";
import { Mark } from "./mark";
import { DrawPolygon } from "@/helper/drawPolygon";
import "leaflet.offline";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { controlSaveTiles } from "@/helper/controlSaveTiles";
export default function Map() {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const {
    showPointList,
    points,
    getAllPoints,
    getSettings,
    settings,
    isLoading,
    setMap,
    getAllPolygons,
    polygons,
    map,
  } = useAppStore((state) => state);
  const { setOpen, modal } = useModal((state) => state);
  const [pointLabel, setPointLabel] = useState<Partial<IPoint>>({});

  const [once, setOnce] = useState(true);

  // Fetch all points
  useEffect(() => {
    if (once) {
      setOnce(false);
      getAllPoints();
      getSettings();
      getAllPolygons();
    }

    if (map) {
      DrawPolygon(map, getAllPolygons);
      map.on("dblclick", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setOpen(
          <Modals title="Create Point">
            <PointForm type="create" />
          </Modals>,
          // @ts-expect-error thee
          { point: { name: "", lat: lat, lng: lng, frequency: 0 } },
        );
      });
      controlSaveTiles({ map, setProgress, setTotal });
    }
  }, [map]);
  useEffect(() => {
    if (progress > 0 && total > 0 && !modal) {
      setOpen(
        <DownloadModal progress={progress} total={total}></DownloadModal>,
      );
    }
  }, [progress, total]);

  return (
    <div className="flex size-full flex-col">
      <ModalProvider></ModalProvider>
      <div className={"relative size-full"}>
        <MapContainer
          center={
            settings?.lat
              ? [settings.lat, settings.lng]
              : [35.695246913723636, 51.41011318883557]
          }
          zoom={settings?.zoom ? settings?.zoom : 13}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {isLoading ? (
            <div className="relative z-[999] flex size-full items-center justify-center bg-transparent">
              <Spinner label="please wait..." />
            </div>
          ) : (
            <>
              <MarkerClusterGroup>
                {points.length > 0 &&
                  points.map(
                    (point) =>
                      point.status === "active" && (
                        <Mark
                          key={point._id}
                          point={point}
                          setPointLabel={setPointLabel}
                        ></Mark>
                      ),
                  )}
              </MarkerClusterGroup>
              {polygons.length > 0 &&
                polygons.map((polygon) => (
                  <Polygon
                    key={polygon._id}
                    positions={polygon.points.map((point) => [
                      point.lat,
                      point.lng,
                    ])}
                  >
                    <Tooltip permanent>{polygon.name}</Tooltip>
                  </Polygon>
                ))}
            </>
          )}
        </MapContainer>
        {pointLabel?.lat && (
          <div
            className={
              "absolute bottom-4 right-4 z-[999] flex flex-col gap-1 rounded-lg bg-white p-2 text-xs transition-all duration-300"
            }
          >
            s<span>lat: {pointLabel?.lat}</span>
            <span>lng: {pointLabel?.lng}</span>
          </div>
        )}
      </div>

      <div
        className={`mt-3 flex w-full flex-col  ${
          showPointList ? "h-2/5" : "h-0 overflow-hidden"
        } transition-all duration-300`}
      >
        <Toolbar></Toolbar>
        <Tables></Tables>
      </div>
    </div>
  );
}
