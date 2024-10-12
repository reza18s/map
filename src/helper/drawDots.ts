"use client";
import { useAppStore } from "@/store/store";
import L from "leaflet";
import { calculateDotPosition } from "./math";

// Draw function to handle both lines and polygons
export const DrawDots = async ({
  lat,
  lng,
  data,
}: {
  lat: number;
  lng: number;
  data: { data: { angle: number } }[];
}) => {
  const drawnItems = new L.FeatureGroup();
  const map = useAppStore.getState().map;
  map?.addLayer(drawnItems);
  const dots = data.map((el) => {
    const latlng = calculateDotPosition(+lat, +lng, +el.data.angle);
    const layer = new L.CircleMarker(latlng, { radius: 1 });
  });
};
