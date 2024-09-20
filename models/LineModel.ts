// models/LineModel.ts
import mongoose from "mongoose";

// تعریف اسکیمای خط
const lineSchema = new mongoose.Schema({
  startPoint: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  endPoint: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  length: { type: Number, required: true }, // طول خط
  angle: { type: Number, required: true }, // زاویه خط
  createdAt: { type: Date, default: Date.now }, // تاریخ ایجاد خط
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // کاربری که خط را ایجاد کرده است (اختیاری)
  deletedAt: { type: Date, default: null }, // تاریخ حذف (برای حذف نرم)
});

// ایجاد مدل خط با استفاده از اسکیمای تعریف‌شده
const LineModel = mongoose.models.Lines || mongoose.model("Lines", lineSchema);

export default LineModel;
