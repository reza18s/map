"use client";
import {
  Button,
  DateRangePicker,
  DateValue,
  Input,
  RangeValue,
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
import { RefreshCw, SearchIcon, Settings, X } from "lucide-react";

export const Toolbar = () => {
  const { points, getAllPoints, isLoading, setPoints, refreshAllData } =
    useAppStore((state) => state);
  const { setOpen } = useModal((state) => state);

  const { register, setValue, watch } = useForm({
    mode: "onBlur",
    defaultValues: {
      search: "",
    },
  });

  const [date, setDate] = useState<RangeValue<DateValue>>();
  const [from, setFrom] = useState<TimeInputValue>();
  const [to, setTo] = useState<TimeInputValue>();
  const searchVal = watch("search");
  const searchPointsHandler = () => {
    if (!searchVal) {
      getAllPoints(); // Reset points to default if no search value
      return;
    }
    const filteredPoints = points.filter((data) =>
      data.name.toLowerCase().includes(searchVal.toLowerCase()),
    );

    setPoints(filteredPoints);
  };

  // Date and Time Filter Handler
  const sortByDateHandler = () => {
    if (!date?.start || !date?.end) {
      return;
    }
    //@ts-expect-error the
    const startDate = new Date(date.start); //@ts-expect-error the
    const endDate = new Date(date.end);
    const filteredPoints = points.filter((point) => {
      const pointDate = new Date(point.date);
      const isWithinDateRange = pointDate >= startDate && pointDate <= endDate;
      if (from && to) {
        const pointTime = `${pointDate.getHours()}:${pointDate.getMinutes()}`;
        const fromTime = `${from.hour}:${from.minute}`;
        const toTime = `${to.hour}:${to.minute}`;

        return (
          isWithinDateRange && pointTime >= fromTime && pointTime <= toTime
        );
      }
      return isWithinDateRange;
    });
    setPoints(filteredPoints);
  };

  return (
    <div className="flex w-full items-center justify-between px-4 pb-1">
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
                    searchPointsHandler();
                  }}
                >
                  <X />
                </button>
              )}
              <button onClick={searchPointsHandler}>
                <SearchIcon size={20}></SearchIcon>
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
          onChange={(x) => setDate(x)}
          hideTimeZone
          defaultValue={date}
        />
        <TimeInput
          label="from"
          value={from}
          onChange={setFrom}
          labelPlacement="outside-left"
        />
        <TimeInput
          label="to"
          value={to}
          onChange={setTo}
          labelPlacement="outside-left"
        />
        <Button
          onClick={sortByDateHandler}
          variant="shadow"
          className="bg-indigo-600 text-white shadow-indigo-200"
        >
          Filter
        </Button>
        {date?.start && (
          <button
            onClick={() => {
              setDate(undefined); // Reset date
              setFrom(undefined);
              setTo(undefined);
              getAllPoints(); // Reset points list
            }}
          >
            <X />
          </button>
        )}
      </div>

      <div className="flex flex-row-reverse items-center gap-4">
        {/* Settings Button */}
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
          {isLoading ? <Spinner size="sm" color="white" /> : <Settings />}
        </button>

        <button
          onClick={() => {
            refreshAllData();
          }}
          className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shadow-lg shadow-gray-200 transition-all duration-300 active:scale-95"
        >
          <RefreshCw />
        </button>
      </div>
    </div>
  );
};
