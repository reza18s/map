import connectDB from "@/configs/db";
import MapModel from "@/models/MapModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { search } = body;

    const points = await MapModel.find({ name: search, deletedAt: null });
    return NextResponse.json(points);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
