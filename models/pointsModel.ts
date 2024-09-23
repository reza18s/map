import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
  iconType: {
    type: String,
  },
  deletedAt: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  dFrequency: { type: Number, required: true }, // Target frequency
  dAzimuth: { type: Number, required: true }, // Azimuth angle
  dLevel: { type: Number, required: true }, // Signal level
  dQuality: { type: Number, required: true, min: 0, max: 100 }, // Signal quality (0 to 100)
});

const PointsModel = mongoose.models.Points || mongoose.model("Points", schema);

export default PointsModel;
