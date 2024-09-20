import { connectDB } from "@/configs/db";
import PolygonsModel from "@/models/PolygonModel";
import { NextResponse } from "next/server";

// Create a new polygon
export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure DB connection is successful
    const body = await req.json();
    const { name, points, flag } = body;

    if (!name || !points || flag === undefined) {
      throw new Error("Missing required fields");
    }

    const polygon = await PolygonsModel.create({
      name,
      points,
      flag,
      isPolygon: true,
    });

    return NextResponse.json({
      message: "Polygon created successfully!",
      polygon,
    });
  } catch (err) {
    // @ts-expect-error the
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// Get polygons (without deleted ones)
export async function GET() {
  try {
    await connectDB();
    const polygons = await PolygonsModel.find({
      isPolygon: true,
      deletedAt: null,
      flag: 1,
    });
    return NextResponse.json(polygons);
  } catch (err) {
    // @ts-expect-error the
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// Update polygon
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, points, flag } = body;

    await PolygonsModel.findOneAndUpdate(
      { _id: id },
      { $set: { name, points, flag } },
    );

    return NextResponse.json({ message: "Polygon updated!" });
  } catch (err) {
    // @ts-expect-error the
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// Soft delete polygon by setting `deletedAt`
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    await PolygonsModel.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );

    return NextResponse.json({ message: "Polygon deleted successfully!" });
  } catch (err) {
    // @ts-expect-error the
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
