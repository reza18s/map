"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { useAppStore } from "@/store/store";
import { Compass, Eye, EyeOff, Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function Sidebar() {
  const setOpen = useModal((state) => state.setOpen);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { showPointList, setShowPointList, points } = useAppStore(
    (state) => state,
  );
  return (
    <div
      className={`${openSidebar ? "min-w-96" : "min-w-16"} relative  transition-all duration-300`}
    >
      <div
        className={`${openSidebar ? "min-w-96 p-5" : "min-w-16 p-2"} fixed bottom-0 flex h-full flex-col justify-between  gap-4 bg-indigo-100 pt-3 transition-all duration-300`}
      >
        <div>
          <div
            className={`${openSidebar ? "flex-row" : "flex-col-reverse gap-4"} flex  justify-between`}
          >
            <Image
              src="/assets/logo.png"
              width={0}
              height={0}
              sizes="100vw"
              className={"w-10 object-cover"}
              alt=""
              priority
            />
            <button
              onClick={() => setOpenSidebar(!openSidebar)}
              className="flex size-10 items-center justify-center rounded-xl bg-indigo-200 text-indigo-600 "
            >
              <Menu></Menu>
            </button>
          </div>
          <div className={`${openSidebar ? "" : "hidden"} my-5`}>
            <Accordion type="single" collapsible>
              {points.map((point) => (
                <AccordionItem key={point._id} value={point.name}>
                  <AccordionTrigger className="my-1 h-10 rounded-xl bg-slate-100">
                    <div className="flex flex-row ">
                      <div className="ml-2 text-sm font-medium">
                        {point.name}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="rounded-xl bg-slate-100">
                    <div className="flex  w-full flex-col text-lg">
                      <div className="flex h-10 items-center border-b-1">
                        <div className="pl-2 text-sm">
                          <span className="font-semibold">Lat: </span>
                          {point.lat}
                        </div>
                        <div className="pl-2 text-sm">
                          <span className="font-semibold">Lug: </span>
                          {point.lng}
                        </div>
                      </div>
                      <div className="flex h-10 items-center justify-between border-b-1 px-2">
                        <div className="border-b-1 text-sm">
                          <span className="font-semibold">Status: </span>
                          {point.status == "active" ? (
                            <span className="pl-1 text-green-600">
                              {point.status}
                            </span>
                          ) : (
                            <span className="pl-1 text-rose-600">
                              {point.status}
                            </span>
                          )}
                        </div>
                        <div className="pl-2 pr-20 text-sm">
                          <span className="font-semibold">Frequency: </span>
                          {point.frequency}
                        </div>
                      </div>
                      <div className="flex flex-row items-center pl-2 pt-2 text-sm">
                        Degree:{" "}
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 100 100"
                          role="img"
                          preserveAspectRatio="xMidYMid meet"
                          className={`rotate-[${point.dQuality}deg]`}
                        >
                          <path
                            d="M50.03 5a2.516 2.516 0 0 0-2.43 1.76L34.493 48.548a2.51 2.51 0 0 0-.372 1.454c-.026.51.104 1.017.372 1.452l13.105 41.782c.737 2.352 4.065 2.352 4.802 0l13.105-41.785c.27-.436.399-.945.372-1.456a2.513 2.513 0 0 0-.372-1.45L52.401 6.76A2.513 2.513 0 0 0 50.03 5zM39.403 50.288h6.205c.152 2.306 2.048 4.134 4.392 4.134c2.344 0 4.24-1.828 4.392-4.134h6.461L50 84.078z"
                            fill="#000000"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="">
          <button
            onClick={() =>
              setOpen(
                <Modals title="add new point">
                  <PointForm></PointForm>
                </Modals>,
              )
            }
            className={`${openSidebar ? "h-10 w-full px-4" : "size-10  justify-center"} my-3 flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-200 font-bold text-indigo-600 transition-all duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`${openSidebar ? "size-6" : "size-5"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>

            {openSidebar && <span>Add new point</span>}
          </button>

          <button
            onClick={() => setShowPointList(!showPointList)}
            className={`${openSidebar ? "h-10 w-full px-4" : "size-10  justify-center"} flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-200 font-bold text-indigo-600 transition-all duration-300`}
          >
            {showPointList ? <EyeOff></EyeOff> : <Eye></Eye>}

            {openSidebar && (
              <span>
                {showPointList ? "Hide points list" : "Show points list"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
