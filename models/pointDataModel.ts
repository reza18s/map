import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    data: { type: {}, require: true },
  },
  {
    timestamps: true,
  },
);

const PointsDataModel =
  mongoose.models.PointsData || mongoose.model("PointsData", schema);

export default PointsDataModel;
