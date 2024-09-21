import mongoose from "mongoose";

const TargetSchema = new mongoose.Schema(
  {
    dFrequency: { type: Number, required: true }, // Target frequency
    dAzimuth: { type: Number, required: true }, // Azimuth angle
    dLevel: { type: Number, required: true }, // Signal level
    dQuality: { type: Number, required: true, min: 0, max: 100 }, // Signal quality (0 to 100)
  },
  { timestamps: true },
);

const Target = mongoose.model("Target", TargetSchema);
module.exports = Target;
