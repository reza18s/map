import { NextResponse } from "next/server";
import LineModel from "@/models/LineModel";
import { connectDB } from "@/configs/db";
import { handleError } from "@/utils/errorHandler";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { startPoint, endPoint, length, angle } = body;

    if (
      !startPoint ||
      !endPoint ||
      length === undefined ||
      angle === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const line = await LineModel.create({
      startPoint,
      endPoint,
      length,
      angle,
    });

    return NextResponse.json({ message: "Line created successfully!", line });
  } catch (err: any) {
    return NextResponse.json({ message: "somthing went wrong" });
  }
}
export async function GET() {
  try {
    await connectDB();
    const lines = await LineModel.find({ deletedAt: null }); // Fetch all non-deleted lines
    return NextResponse.json(lines);
  } catch (err: any) {
    return handleError(err);
  }
}
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Line ID is required" },
        { status: 400 },
      );
    }

    const deletedLine = await LineModel.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Ensure that the line hasn't been soft-deleted already
      { $set: { deletedAt: new Date() } },
      { new: true },
    );

    if (!deletedLine) {
      return NextResponse.json({ message: "Line not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Line deleted successfully!",
      deletedLine,
    });
  } catch (err: any) {
    return handleError(err);
  }
}
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, startPoint, endPoint, length, angle } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Line ID is required" },
        { status: 400 },
      );
    }

    const updatedLine = await LineModel.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Ensure that the line exists and hasn't been soft-deleted
      { $set: { startPoint, endPoint, length, angle } },
      { new: true }, // Return the updated document
    );

    if (!updatedLine) {
      return NextResponse.json({ message: "Line not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Line updated successfully!",
      updatedLine,
    });
  } catch (err: any) {
    return handleError(err);
  }
}
