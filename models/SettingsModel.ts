import mongoose from "mongoose";

const schema = new mongoose.Schema({
  lat: { type: Number, required: true, default: 35.694523130867424 },
  lng: { type: Number, required: true, default: 51.30922197948697 },
  zoom: { type: Number, required: true, default: 13 },
  PointIcon: {
    type: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    default: [
      { name: "car", url: "/assets/car.svg" },
      { name: "bus", url: "/assets/bus.svg" },
      { name: "plane", url: "/assets/plane.svg" },
    ],
  },
});

const SettingsModel =
  mongoose.models.Settings || mongoose.model("Settings", schema);

export default SettingsModel;
