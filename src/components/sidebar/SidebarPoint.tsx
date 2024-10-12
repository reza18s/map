import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { IPoint } from "@/types";
import { putData } from "@/services/API";
import { Chip } from "@nextui-org/react";
import { statusColorMap } from "../map/Table";
import { shutdownWorker } from "@/helper/workerManager";
import { Chart } from "./chart";
import { PointDataFilter } from "../global/pointDataFilter";

export const SidebarPoint = ({
  points,
  openSidebar,
  getAllPoints,
}: {
  points: IPoint[];
  openSidebar: boolean;
  getAllPoints: () => void;
}) => {
  const changeStatusHandler = (id: string, data: Partial<IPoint>) => {
    if (!data.connect) {
      shutdownWorker(id);
    }
    putData("/api/points", { id, ...data }).then(() => {
      getAllPoints();
    });
  };
  return (
    <div
      className={`${openSidebar ? "" : "hidden"} my-5 max-h-[700px] overflow-y-scroll`}
    >
      <Accordion type="single" collapsible>
        {points.map((point) => (
          <AccordionItem key={point._id} value={point._id}>
            <AccordionTrigger className="my-1 h-10 rounded-xl bg-slate-100">
              <div className="flex flex-row ">
                <div className="ml-2 text-sm font-medium">
                  name: {point.name}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="rounded-xl bg-slate-100 pb-0">
              <div className="flex w-full flex-col text-lg">
                <div className="flex h-12 items-center border-b-1">
                  <div className="flex flex-col pl-2 text-sm">
                    <span className="font-semibold">Lat: </span>
                    {point.lat}
                  </div>

                  <div className="px-2 text-sm">
                    <span className="font-semibold">status: </span>
                    <button
                      onClick={() =>
                        changeStatusHandler(point._id, {
                          status: !point.status,
                        })
                      }
                    >
                      <Chip
                        className="capitalize"
                        color={
                          statusColorMap[point.status ? "active" : "disable"]
                        }
                        size="sm"
                        variant="flat"
                      >
                        {point.status ? "active" : "disable"}
                      </Chip>
                    </button>
                  </div>
                  <div className="flex flex-row items-center  text-sm">
                    Degree:{" "}
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 100 100"
                      role="img"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ rotate: `${point.level}deg` }}
                    >
                      <circle
                        r="45"
                        cx="50"
                        cy="50"
                        className="fill-transparent"
                        stroke="black"
                        strokeWidth="5"
                      ></circle>
                      <path
                        d="M50.03 5a2.516 2.516 0 0 0-2.43 1.76L34.493 48.548a2.51 2.51 0 0 0-.372 1.454c-.026.51.104 1.017.372 1.452l13.105 41.782c.737 2.352 4.065 2.352 4.802 0l13.105-41.785c.27-.436.399-.945.372-1.456a2.513 2.513 0 0 0-.372-1.45L52.401 6.76A2.513 2.513 0 0 0 50.03 5zM39.403 50.288h6.205c.152 2.306 2.048 4.134 4.392 4.134c2.344 0 4.24-1.828 4.392-4.134h6.461L50 84.078z"
                        fill="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="flex h-10 items-center border-b-1">
                  <div className="flex flex-col pl-2 text-sm">
                    <span className="font-semibold">Lng: </span>
                    <span>{point.lng}</span>
                  </div>
                  <div className="px-2 text-sm">
                    <span className="font-semibold">connect: </span>
                    <button
                      onClick={() =>
                        changeStatusHandler(point._id, {
                          connect: !point.connect,
                        })
                      }
                    >
                      <Chip
                        className="capitalize"
                        color={
                          statusColorMap[point.connect ? "active" : "disable"]
                        }
                        size="sm"
                        variant="flat"
                      >
                        {point.connect ? "connect" : "disconnect"}
                      </Chip>
                    </button>
                  </div>
                </div>
                <div className="flex h-10 items-center gap-4 px-2">
                  <div className="pr-2 text-sm">
                    <span className="font-semibold">Frequency: </span>
                    {point.frequency}
                  </div>
                  <div className="pl-2 text-sm">
                    <span className="font-semibold">active: </span>
                    <button
                      onClick={() =>
                        changeStatusHandler(point._id, {
                          active: !point.active,
                        })
                      }
                    >
                      <Chip
                        className="capitalize"
                        color={
                          statusColorMap[point.active ? "active" : "disable"]
                        }
                        size="sm"
                        variant="flat"
                      >
                        {point.active ? "active" : "disable"}
                      </Chip>
                    </button>
                  </div>
                </div>

                <PointDataFilter point={point}></PointDataFilter>
                <Chart point={point}></Chart>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
