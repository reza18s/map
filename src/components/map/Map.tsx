import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet.offline";
import "leaflet/dist/leaflet.css";
import { Spinner } from "@nextui-org/react";
import { postData } from "@/services/API";
import { PointIcon } from "./PointIcon";
import { useAppStore } from "@/store/store";
import { IPoint } from "@/types";
import { ModalProvider } from "@/providers/ModalProvider";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { DeletePointModal } from "../modals/deletePointModal";
import { Tables } from "./Table";
import { Toolbar } from "./toolbar";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DownloadModal } from "../modals/downloadModal";
import { EditIcon, Trash2 } from "lucide-react";
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
    }

    if (map) {
      // map.locate({ setView: true, maxZoom: 16 });
      // map.on("locationfound", (e) => {
      //   L.marker(e.latlng).addTo(map).bindPopup("You are here!").openPopup();
      // });
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
      const tileLayerOffline = L.tileLayer.offline(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abc",
          minZoom: 11,
          maxZoom: 16,
        },
      );
      tileLayerOffline.addTo(map);
      const controlSaveTiles = L.control.savetiles(tileLayerOffline, {
        zoomlevels: [11, 12, 13, 14, 15, 16],
        confirm(layer: any, succescallback: () => void) {
          if (
            window.confirm(
              `Are you sure you want to download ${layer._tilesforSave.length} tiles?`,
            )
          ) {
            succescallback();
          }
        },
        confirmRemoval(layer: any, successCallback: () => void) {
          if (window.confirm("Are you sure you want to remove all tiles?")) {
            successCallback();
          }
        },
        saveText: `<div class="w-full h-full flex justify-center items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>`,
        rmText: `<div class="w-full h-full flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>`,
      });

      controlSaveTiles.addTo(map);

      let progress: number;
      tileLayerOffline.on("savestart", (e: any) => {
        progress = 0;
        setTotal(e._tilesforSave.length);
      });
      tileLayerOffline.on("savetileend", () => {
        progress += 1;
        setProgress(progress);
      });
    }
  }, [map]);
  useEffect(() => {
    if (progress > 0 && total > 0 && !modal) {
      setOpen(
        <DownloadModal progress={progress} total={total}></DownloadModal>,
      );
    }
  }, [progress, total]);
  const changeStatusHandler = (id: string) => {
    postData("/api/points/change-status", { id }).then(() => {
      getAllPoints();
    });
  };

  return (
    <div className="flex size-full flex-col">
      <ModalProvider></ModalProvider>
      <div className={"relative size-full"}>
        {isLoading ? (
          <div className="flex size-full items-center justify-center bg-gray-50">
            <Spinner label="please wait..." />
          </div>
        ) : (
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

            <MarkerClusterGroup>
              {points.length > 0 &&
                points.map(
                  (point) =>
                    point.status === "active" && (
                      <Marker
                        key={point._id}
                        icon={PointIcon}
                        position={[point.lat, point.lng]}
                        eventHandlers={{
                          mouseover: () => {
                            setPointLabel(point);
                          },
                          mouseout: () => {
                            setPointLabel({});
                          },
                        }}
                      >
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
                                onClick={() =>
                                  setOpen(
                                    <DeletePointModal
                                      data={point}
                                    ></DeletePointModal>,
                                  )
                                }
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
                    ),
                )}
            </MarkerClusterGroup>
          </MapContainer>
        )}
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
        className={`mt-3 flex w-full flex-col ${
          showPointList ? "h-2/5" : "h-0 overflow-hidden"
        } transition-all duration-300`}
      >
        <Toolbar></Toolbar>
        <Tables></Tables>
      </div>
    </div>
  );
}
