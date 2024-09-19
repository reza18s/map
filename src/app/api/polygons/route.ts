import connectDB from "@/configs/db";
import PolygonsModel from "@/models/PolygonModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure the DB connection is correct
    const body = await req.json();
    const { name, points, flag } = body;

    if (!name || !points || !flag) {
      throw new Error("Missing required fields");
    }

    // Create a new polygon in the database
    const polygon = await PolygonsModel.create({
      name,
      points,
      flag,
      isPolygon: true,
    });

    return NextResponse.json(
      { message: "Polygon created successfully!", polygon },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating polygon:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const polygons = await PolygonsModel.find({ isPolygon: true, flag: 1 });
    return NextResponse.json(polygons);
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
