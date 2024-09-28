import mongoose from "mongoose";

const schema = new mongoose.Schema({
  dFrequency: { type: Number, required: true }, // Target frequency
  dAzimuth: { type: Number, required: true }, // Azimuth angle
  dLevel: { type: Number, required: true }, // Signal level
  dQuality: { type: Number, required: true, min: 0, max: 100 }, // Signal quality (0 to 100)
});

const TargetModel = mongoose.models.Target || mongoose.model("Target", schema);

export default TargetModel;
