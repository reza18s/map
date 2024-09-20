import { connectDB } from "@/configs/db";
import PointsModel from "@/models/pointsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { search } = body;

    const points = await PointsModel.find({ name: search, deletedAt: null });
    return NextResponse.json(points);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
