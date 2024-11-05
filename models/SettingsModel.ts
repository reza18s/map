import mongoose from "mongoose";

const schema = new mongoose.Schema({
  lat: { type: Number, required: true, default: 35.694523130867424 },
  lng: { type: Number, required: true, default: 51.30922197948697 },
  zoom: { type: Number, required: true, default: 13 },
  frequency: { type: Number },
});

const SettingsModel =
  mongoose.models.Settings || mongoose.model("Settings", schema);

export default SettingsModel;
