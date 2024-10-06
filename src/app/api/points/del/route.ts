import { connectDB } from "@/configs/db";
import PointsModel from "@/models/pointsModel";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    await PointsModel.findByIdAndDelete({ _id: id });
    return NextResponse.json({ message: "Point deleted successfully!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
