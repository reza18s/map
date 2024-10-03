import { connectDB } from "@/configs/db";
import { startPointWorker } from "@/helper/workerManager";
import PointsModel from "@/models/pointsModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      lat,
      lng,
      date,
      deletedAt,
      name,
      frequency,
      iconType,
      active,
      connect,
      status,
      level,
    } = body;

    const points = await PointsModel.create({
      lat,
      lng,
      date,
      name,
      iconType,
      frequency,
      deletedAt,
      active,
      connect,
      status,
      level,
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
    const points = await PointsModel.find({ deletedAt: null }, "-__v");
    return NextResponse.json(points);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      lat,
      lng,
      id,
      name,
      point,
      frequency,
      iconType,
      active,
      connect,
      status,
      level,
    } = body;

    await PointsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          lat,
          lng,
          name,
          point,
          frequency,
          iconType,
          active,
          connect,
          status,
          level,
        },
      },
    );

    return NextResponse.json({ message: "Polygon updated!" });
  } catch (err) {
    // @ts-expect-error the
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    await PointsModel.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return NextResponse.json({ message: "Point deleted successfully!" });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
