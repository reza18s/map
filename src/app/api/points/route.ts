import connectDB from "@/configs/db";
import MapModel from "@/models/MapModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { lat, lng, date, deletedAt, name, frequency } = body;

    const points = await MapModel.create({
      lat,
      lng,
      date,
      name,
      frequency,
      deletedAt,
    });
    return NextResponse.json(
      { message: "Point created successfully!", points },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const points = await MapModel.find({ deletedAt: null }, "-__v");
    return NextResponse.json(points);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    await MapModel.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return NextResponse.json({ message: "Point deleted successfully!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
