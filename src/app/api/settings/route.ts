import { connectDB } from "@/configs/db";
import PointsModel from "@/models/pointsModel";
import SettingsModel from "@/models/SettingsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { lat, lng, zoom, frequency } = body;
    if (frequency) {
      await PointsModel.updateMany({}, { $set: { frequency } });
    }
    await SettingsModel.findOneAndUpdate(
      { _id: "6703d33db86aa836f46946c6" },
      { $set: { lat, lng, zoom, frequency } },
    );
    return NextResponse.json(
      { message: "Point updated successfully!" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    let settings;

    settings = await SettingsModel.findOne(
      { _id: "6703d33db86aa836f46946c6" },
      "-__v",
    );
    if (!settings) {
      settings = await SettingsModel.create({
        _id: "6703d33db86aa836f46946c6",
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
