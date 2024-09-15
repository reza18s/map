import connectDB from "@/configs/db";
import MapModel from "@/models/MapModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, lat, lng, frequency, id } = body;

    await MapModel.findOneAndUpdate(
      { _id: id },
      { $set: { name, lat, lng, frequency } },
    );
    return NextResponse.json({ message: "Point updated!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
