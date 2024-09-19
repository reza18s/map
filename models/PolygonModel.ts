import mongoose from "mongoose";

const polygonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: [{ lat: Number, lng: Number }], // Array of polygon vertices
  flag: { type: Number, default: 1 }, // 0 (hide) or 1 (show)
  isPolygon: { type: Boolean, default: true }, // True for polygons
  date: { type: Date, default: Date.now },
  deletedAt: { type: mongoose.Schema.Types.Mixed, default: null },
});
const PolygonsModel =
  mongoose.models.Polygons || mongoose.model("Polygons", polygonSchema);

export default PolygonsModel;
