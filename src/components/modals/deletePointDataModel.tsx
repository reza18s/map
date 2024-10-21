"use client";
import React, { useEffect, useState } from "react";
import { Modals } from ".";
import {
  Button,
  DateRangePicker,
  DateValue,
  ModalBody,
  ModalFooter,
  RangeValue,
  Spinner,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import { useModal } from "@/store/useModal";
import { deleteData } from "@/services/API";
export const DelPointDataModel = () => {
  const setClose = useModal((state) => state.setClose);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>();
  const [fromTime, setFromTime] = useState<TimeInputValue>();
  const [toTime, setToTime] = useState<TimeInputValue>();
  const [loading, setLoading] = useState(false);
  // Function to fetch data
  const fetchData = async () => {
    if (!dateRange?.start || !dateRange?.end) {
      alert("Please select a date range");
      return;
    }
    setLoading(true);
    // Convert dates to timestamps
    // @ts-expect-error the
    const startDate = new Date(dateRange.start);
    // @ts-expect-error the
    const endDate = new Date(dateRange.end);
    // Add the times to the date
    if (fromTime) {
      startDate.setHours(fromTime.hour, fromTime.minute, 0, 0);
    } else {
      startDate.setHours(0, 0, 0, 0);
    }
    if (toTime) {
      endDate.setHours(toTime.hour, toTime.minute, 0, 0);
    } else {
      endDate.setHours(23, 59, 59, 999);
    }
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    // Fetch data from the backend API
    try {
      await deleteData(
        `/api/points/data?startTime=${startTimestamp}&endTime=${endTimestamp}`,
        {},
      );
      setClose();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modals title={"delete point data"}>
      <ModalBody>
        <div className="flex flex-col gap-4 p-2">
          <DateRangePicker
            aria-label="Select date range"
            value={dateRange}
            size="sm"
            onChange={(range) => setDateRange(range)}
          />

          <div className="flex gap-4">
            <TimeInput
              label="From"
              size="sm"
              value={fromTime}
              onChange={(time) => setFromTime(time)}
            />
            <TimeInput
              label="To"
              size="sm"
              value={toTime}
              onChange={(time) => setToTime(time)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center">
        <Button
          color="danger"
          variant="light"
          type="button"
          onClick={() => setClose()}
        >
          Close
        </Button>
        <Button
          onClick={fetchData}
          disabled={loading}
          className="h-10 bg-red-500 text-white"
        >
          {loading ? <Spinner size="sm" /> : "delete Data"}
        </Button>
      </ModalFooter>
    </Modals>
  );
};
