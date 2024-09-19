"use client"
import React, { useState } from "react";
import Image from "next/image";
import { useModal } from "@/store/useModal";
import { Modals } from "../modals";
import { PointForm } from "../forms/pointForm";
import { useAppStore } from "@/store/store";

export default function Sidebar() {
  const setOpen = useModal((state) => state.setOpen);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { showPointList, setShowPointList } = useAppStore((state) => state);
  return (
    <div
      className={`${openSidebar ? "min-w-60" : "min-w-16"} relative transition-all duration-300`}
    >
      <div
        className={`${openSidebar ? "min-w-60 p-5" : "min-w-16 p-2"} fixed bottom-0 flex h-full flex-col items-center gap-4 bg-indigo-100 pt-3 transition-all  duration-300`}
      >
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="flex size-10 items-center justify-center rounded-xl bg-indigo-200 text-indigo-600"
        >
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div className="my-10 flex h-auto w-full items-center justify-center">
          <Image
            src="/assets/logo.png"
            width={0}
            height={0}
            sizes="100vw"
            className={`${openSidebar ? "w-20" : "w-10"} object-cover`}
            alt=""
            priority
          />
        </div>

        <button
          onClick={() =>
            setOpen(
              <Modals title="add new point">
                <PointForm></PointForm>
              </Modals>,
            )
          }
          className={`${openSidebar ? "h-14 w-full px-4" : "size-10  justify-center"} flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-200 font-bold text-indigo-600 transition-all duration-300`}
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
          className={`${openSidebar ? "h-14 w-full px-4" : "size-10  justify-center"} flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-200 font-bold text-indigo-600 transition-all duration-300`}
        >
          {showPointList ? (
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}

          {openSidebar && (
            <span>
              {showPointList ? "Hide points list" : "Show points list"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
