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
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  connect: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
  requireData: {
    type: Array,
    default: [],
  },
  port: {
    type: Number,
    default: 5000,
  },
  iconType: {
    type: String,
  },
  workerStatus: { type: String, default: "inactive" },
  PointsData: [{ type: mongoose.Types.ObjectId, ref: "PointsData" }],
  deletedAt: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const PointsModel = mongoose.models.Points || mongoose.model("Points", schema);

export default PointsModel;
