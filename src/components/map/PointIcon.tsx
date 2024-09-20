import L from "leaflet";

export const getPointIcon = (iconType: string) => {
  switch (iconType) {
    case "car":
      return L.icon({
        iconUrl: "/assets/car.svg",
        iconSize: [32, 32],
      });
    case "plane":
      return L.icon({
        iconUrl: "/assets/plane.svg",
        iconSize: [32, 32],
      });
    case "bus":
      return L.icon({
        iconUrl: "/assets/bus.svg",
        iconSize: [32, 32],
      });
    default:
      return L.icon({
        iconUrl: "/assets/icon.png",
        iconSize: [32, 32],
      });
  }
};
