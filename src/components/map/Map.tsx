/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet.offline";
import "leaflet/dist/leaflet.css";
import {
  Button,
  Chip,
  DateRangePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TimeInput,
  Tooltip,
} from "@nextui-org/react";
import { deleteData, getData, postData } from "@/services/API";
import { PointIcon } from "./PointIcon";
import { useForm } from "react-hook-form";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { dateFormatter } from "@/helper/helper";
import { useAppStore } from "@/store/store";
import { NewPoint } from "../modals";
import { IPoint } from "@/types";
import { ModalProvider } from "@/providers/ModalProvider";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { PointAction } from "../global/pointAction";

// Define interfaces for settings and point objects
interface Settings {
  lat: number;
  lng: number;
  zoom: number;
}

// Define table columns
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

const statusColorMap: { [key: string]: "success" | "danger" } = {
  active: "success",
  disable: "danger",
};

// Props interface for the Map component
// Map component
export default function Map() {
  const { setAddPointModal, showPointList } = useAppStore((state) => state);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      lat: "",
      lng: "",
      frequency: "",
      lat_settings: "",
      lng_settings: "",
      zoom: "",
      search: "",
    },
  });
  const { setOpen } = useModal((state) => state);

  const [position, setPosition] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [rotateIcon, setRotateIcon] = useState(false);
  const [points, setPoints] = useState<IPoint[]>([]);
  const [pointsList, setPointsList] = useState<IPoint[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsUpdateLoading, setSettingsUpdateLoading] = useState(false);
  const [pointLabel, setPointLabel] = useState<Partial<IPoint>>({});
  const [once, setOnce] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState<any>({});
  const searchVal = watch("search");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // Fetch settings
  const getSettings = () => {
    getData("/api/settings", {})
      .then((res) => {
        setSettings(res.data);
        setSettingsLoading(false);

        // Close modal after settings are updated
        setSettingsModal(false);
        setSettingsUpdateLoading(false);
      })
      .catch(() => {
        setSettingsLoading(false);
      });
  };

  // Fetch all points
  const getAllPoints = () => {
    setLoading(true);

    // Reset flags after updates
    setStatusLoading(false);
    setAddPointModal(false);

    getData("/api/points", {})
      .then((res) => {
        setPoints(res.data);
        setPointsList(res.data);
        if (res.data.length > 0) {
          setPosition([[res.data[0].lat, res.data[0].lng]]);
        }
        setLoading(false);
        setRotateIcon(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (once) {
      setOnce(false);
      getAllPoints();
      getSettings();
    }

    if (map) {
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
        saveText: `<div>Save</div>`,
        rmText: `<div>Remove</div>`,
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

  // Render cells for the table
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
            <p className="text-bold text-sm text-gray-700">
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
            <p className="text-bold text-sm capitalize text-gray-700">
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

  // Handlers for adding, deleting, editing points

  const changeStatusHandler = (id: string) => {
    setStatusLoading(true);
    postData("/api/points/change-status", { id }).then(() => {
      getAllPoints();
    });
  };

  // Settings modal open and update handlers
  const openSettingsModal = () => {
    if (settings) {
      setSettingsModal(true);
      setValue("lat_settings", settings.lat.toString());
      setValue("lng_settings", settings.lng.toString());
      setValue("zoom", settings.zoom.toString());
    }
  };

  const updateSettingsHandler = (data: any) => {
    setSettingsUpdateLoading(true);
    postData("/api/settings", {
      lat: parseFloat(data.lat_settings),
      lng: parseFloat(data.lng_settings),
      zoom: parseInt(data.zoom),
    })
      .then(() => {
        setSettingsUpdateLoading(false);
        window.location.reload();
      })
      .catch(() => {
        setSettingsLoading(false);
      });
  };

  // Search and filter points
  const searchPointsHandler = () => {
    const filteredPoints = points.filter((data) =>
      data.name.toLowerCase().includes(searchVal?.toLowerCase()),
    );
    setPointsList(filteredPoints);
  };

  const sortByDateHandler = () => {
    const startDate = new Date(dateFormatter(date, from).start);
    const endDate = new Date(dateFormatter(date, to).end);
    const result = points.filter((point) => {
      const pointDate = new Date(point.date);
      return pointDate >= startDate && pointDate <= endDate;
    });
    setPointsList(result);
  };

  return (
    <div className="flex size-full flex-col">
      <ModalProvider></ModalProvider>

      {/* settings modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col gap-4">
                  <Input
                    isRequired
                    label="Lat"
                    labelPlacement="outside"
                    placeholder="Enter point lat"
                    isInvalid={!!errors.lat_settings}
                    errorMessage="lat is required"
                    {...register("lat_settings", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lng"
                    labelPlacement="outside"
                    placeholder="Enter point lng"
                    isInvalid={!!errors.lng_settings}
                    errorMessage="lng is required"
                    {...register("lng_settings", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Zoom"
                    labelPlacement="outside"
                    placeholder="Enter map zoom"
                    isInvalid={!!errors.zoom}
                    errorMessage="zoom is required"
                    {...register("zoom", { required: true })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full justify-center gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => setSettingsModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={settingsUpdateLoading}
                    variant="shadow"
                    className="bg-green-600 text-white shadow-green-200"
                    onClick={handleSubmit(updateSettingsHandler)}
                  >
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* download tiles modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={progress > 0 && total > 0}
        onClose={progress === total}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tiles Downloading
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full items-center justify-between gap-2 text-sm">
                  <span>Total Tiles : {total}</span>
                  <span>Downloaded Tiles : {progress}</span>

                  {/* <div className="w-full h-5 rounded-full bg-gray-200">
                    <div
                      style={{ width: `${total / progress}%` }}
                      className="text-xs text-white h-full bg-indigo-600 rounded-full flex justify-center items-center"
                    >
                      {progress}%
                    </div>
                  </div> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full justify-center gap-4">
                  <Spinner size="" label="Please wait..." />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* map & markers */}
      <div className={"relative size-full"}>
        {loading || settingsLoading ? (
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
            ref={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.length > 0 &&
              points.map(
                (point) =>
                  point.status === "active" && (
                    <Marker
                      key={point._id}
                      icon={PointIcon}
                      position={[point.lat, point.lng]}
                      eventHandlers={{
                        mouseover: (e) => {
                          setPointLabel(point);
                        },

                        mouseout: (e) => {
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
                              onClick={() => setPointEditableData(point)}
                              className="cursor-pointer text-lg text-default-400 active:opacity-50"
                            >
                              <EditIcon />
                            </button>

                            <button
                              onClick={() => {
                                setDeleteModal(true);
                                setPointId(point._id);
                              }}
                              className="cursor-pointer text-lg text-danger active:opacity-50"
                            >
                              <DeleteIcon />
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
          </MapContainer>
        )}

        {pointLabel?.lat && (
          <div
            className={
              "absolute bottom-4 right-4 z-[999] flex flex-col gap-1 rounded-lg bg-white p-2 text-xs transition-all duration-300"
            }
          >
            <span>lat: {pointLabel?.lat}</span>
            <span>lng: {pointLabel?.lng}</span>
          </div>
        )}
      </div>

      <div
        className={`mt-3 flex w-full flex-col ${
          showPointList ? "h-2/5" : "h-0 overflow-hidden"
        } transition-all duration-300`}
      >
        {/* toolbar */}
        <div className="flex w-full items-center justify-between px-4">
          <div className="flex justify-center gap-16">
            <Input
              isRequired
              className="w-80"
              labelPlacement="outside"
              placeholder="search point..."
              value={searchVal}
              {...register("search")}
              endContent={
                <div className="flex gap-3">
                  {searchVal?.length > 0 && (
                    <button
                      onClick={() => {
                        setPointsList(points);
                        setValue("search", "");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <button onClick={searchPointsHandler}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-indigo-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </button>
                </div>
              }
              size="md"
            />
          </div>

          <div className="flex flex-row-reverse gap-4">
            <DateRangePicker
              aria-label="filter by date"
              value={date}
              onChange={setDate}
              hideTimeZone
              defaultValue={
                {
                  // start: parseAbsoluteToLocal("2024-04-01T07:45:00Z"),
                  // end: parseAbsoluteToLocal("2024-04-14T19:15:00Z"),
                }
              }
            />

            <TimeInput
              label="to"
              value={to}
              onChange={setTo}
              labelPlacement="outside-left"
            />

            <TimeInput
              label="from"
              value={from}
              onChange={setFrom}
              labelPlacement="outside-left"
            />

            <Button
              onClick={sortByDateHandler}
              variant="shadow"
              className="bg-indigo-600 text-white shadow-indigo-200"
            >
              Filter
            </Button>

            {date.start && (
              <button
                onClick={() => {
                  setPointsList(points);
                  setDate({});
                  setFrom("");
                  setTo("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-row-reverse items-center gap-4">
            {/* settings */}
            <button
              onClick={openSettingsModal}
              className="flex size-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 outline-none transition-all duration-300 active:scale-95"
            >
              {settingsLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>

            {/* refresh data */}
            <button
              onClick={() => {
                setRotateIcon(true);

                getAllPoints();
              }}
              className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-lg shadow-gray-200 transition-all duration-300 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`size-5 ${rotateIcon && "spinner-anim"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>

        <Table
          classNames={{ wrapper: "bg-transparent shadow-none rounded-none" }}
          className="max-h-fit"
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
            isLoading={loading}
            items={pointsList}
            emptyContent="doesn't exist any point  !"
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(
                      item,
                      columnKey,
                      pointsList.findIndex((p) => p._id === item._id) + 1,
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
