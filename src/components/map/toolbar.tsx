import {
  Button,
  DateRangePicker,
  Input,
  Spinner,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Modals } from "../modals";
import { SettingsForm } from "../forms/settingsForm";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/store/store";
import { useModal } from "@/store/useModal";

export const Toolbar = () => {
  const { points, getAllPoints, isLoading } = useAppStore((state) => state);
  const { setOpen } = useModal((state) => state);
  const { register, setValue, watch } = useForm({
    mode: "onBlur",
    defaultValues: {
      search: "",
    },
  });
  const [rotateIcon, setRotateIcon] = useState(false);
  const [date, setDate] = useState<any>({});
  const searchVal = watch("search");
  const [from, setFrom] = useState<TimeInputValue>();
  const [to, setTo] = useState<TimeInputValue>();
  const searchPointsHandler = () => {
    const filteredPoints = points.filter((data) =>
      data.name.toLowerCase().includes(searchVal?.toLowerCase()),
    );
    // setPointsList(filteredPoints);
  };

  const sortByDateHandler = () => {
    // @ts-expect-error the
    const startDate = new Date(dateFormatter(date, from).start);
    // @ts-expect-error the
    const endDate = new Date(dateFormatter(date, to).end);
    const result = points.filter((point) => {
      const pointDate = new Date(point.date);
      return pointDate >= startDate && pointDate <= endDate;
    });
    // setPointsList(result);
  };
  return (
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
          defaultValue={{
            start: new Date(Date.now()),
            end: new Date(Date.now()),
          }}
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
              // setPointsList(points);
              setDate({});
              setFrom(undefined);
              setTo(undefined);
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
          onClick={() =>
            setOpen(
              <Modals title="edit point">
                <SettingsForm></SettingsForm>
              </Modals>,
            )
          }
          className="flex size-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 outline-none transition-all duration-300 active:scale-95"
        >
          {isLoading ? (
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
  );
};
