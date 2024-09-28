"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { useAppStore } from "@/store/store";
import { Eye, EyeOff, Menu } from "lucide-react";
import { SidebarPoint } from "./SidebarPoint";

export default function Sidebar() {
  const setOpen = useModal((state) => state.setOpen);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { showPointList, setShowPointList, points, getAllPoints } = useAppStore(
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
          <SidebarPoint
            points={points}
            openSidebar={openSidebar}
            getAllPoints={getAllPoints}
          ></SidebarPoint>
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
