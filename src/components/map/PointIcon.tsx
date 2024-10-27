import L from "leaflet";
export const PointIcon = [
  {
    name: "car",
    url: "/assets/car.svg",
  },
  {
    name: "bus",
    url: "/assets/bus.svg",
  },
  {
    name: "plane",
    url: "/assets/plane.svg",
  },
  {
    name: "ambulance",
    url: "/assets/ambulance.svg",
  },
  {
    name: "person",
    url: "/assets/person.svg",
  },
  {
    name: "walkie-talkie",
    url: "/assets/walkie-talkie.svg",
  },
  {
    name: "train",
    url: "/assets/train.svg",
  },
  {
    name: "point",
    url: "/assets/icon.png",
  },
];
export const getPointIcon = (iconType: string) => {
  const icon = PointIcon.find((val) => val.name == iconType);

  return L.icon({
    iconUrl: icon?.url || "/assets/icon.png",
    iconSize: [32, 32],
  });
};
