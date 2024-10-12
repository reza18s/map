import { connectDB } from "@/configs/db";
import SettingsModel from "@/models/SettingsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { lat, lng, zoom, PointIcon } = body;
    await SettingsModel.findOneAndUpdate(
      { _id: "6703d33db86aa836f46946c6" },
      { $set: { lat, lng, zoom, PointIcon } },
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
    const settings = await SettingsModel.findOne(
      { _id: "6703d33db86aa836f46946c6" },
      "-__v",
    );
    if (!settings) {
      await SettingsModel.create({
        _id: "6703d33db86aa836f46946c6",
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
