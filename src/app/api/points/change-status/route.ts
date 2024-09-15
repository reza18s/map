import connectDB from "@/configs/db";
import MapModel from "@/models/MapModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    const point = await MapModel.findOne({ _id: id });
    await MapModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: point?.status === "active" ? "disable" : "active" } },
    );

    return NextResponse.json({ message: "Point status updated!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
