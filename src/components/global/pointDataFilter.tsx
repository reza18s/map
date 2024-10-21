import { getData } from "@/services/API";
import { useAppStore } from "@/store/store";
import { IPoint } from "@/types";
import {
  Button,
  DateRangePicker,
  DateValue,
  RangeValue,
  Spinner,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import L from "leaflet";
import { calculateDotPosition } from "@/helper/math";
export const PointDataFilter = ({ point }: { point: IPoint }) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>();
  const [fromTime, setFromTime] = useState<TimeInputValue>();
  const [toTime, setToTime] = useState<TimeInputValue>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ data: { angle: number } }[]>([]);
  const [drawnItems, setDrawnItems] = useState<L.FeatureGroup<any>>();

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
      const response = await getData(
        `/api/points/data?id=${point._id}&startTime=${startTimestamp}&endTime=${endTimestamp}`,
        {},
      );
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    const map = useAppStore.getState().map;
    map?.addLayer(drawnItems);
    setDrawnItems(drawnItems);
  }, []);
  useEffect(() => {
    drawnItems?.clearLayers();
    data.map((el) => {
      if (!el.data.angle) {
        return;
      }
      const latlng = calculateDotPosition(
        +point.lat,
        +point.lng,
        +el.data.angle,
      );
      const layer = new L.CircleMarker(latlng, { radius: 1 });
      drawnItems?.addLayer(layer);
    });
  }, [data]);
  return (
    <div className="flex flex-col gap-4 p-2">
      <h2 className="text-lg font-semibold">Play back</h2>

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

      <Button
        onClick={fetchData}
        disabled={loading}
        className="h-6 bg-indigo-600 text-white"
      >
        {loading ? <Spinner size="sm" /> : "playback"}
      </Button>
    </div>
  );
};
