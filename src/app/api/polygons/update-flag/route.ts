import connectDB from "@/configs/db";
import PolygonsModel from "@/models/PolygonModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, flag } = body;

    await PolygonsModel.findOneAndUpdate({ _id: id }, { $set: { flag } });

    return NextResponse.json({ message: "Flag updated!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
