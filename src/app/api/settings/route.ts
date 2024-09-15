import connectDB from "@/configs/db";
import SettingsModel from "@/models/SettingsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { lat, lng, zoom } = body;

    await SettingsModel.findOneAndUpdate(
      { _id: "66c3774a9757762530e4bfd1" },
      { $set: { lat, lng, zoom } },
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
      { _id: "66c3774a9757762530e4bfd1" },
      "-__v",
    );
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
