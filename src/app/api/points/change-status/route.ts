import connectDB from "@/configs/db";
import PointsModel from "@/models/pointsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    const point = await PointsModel.findOne({ _id: id });
    await PointsModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: point?.status === "active" ? "disable" : "active" } },
    );

    return NextResponse.json({ message: "Point status updated!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
