import { useAppStore } from "@/store/store";
import L from "leaflet";

export const getPointIcon = (iconType: string) => {
  const icon = useAppStore
    .getState()
    .settings?.PointIcon.find((val) => val.name == iconType);

  return L.icon({
    iconUrl: icon?.url || "/assets/icon.png",
    iconSize: [32, 32],
  });
};
