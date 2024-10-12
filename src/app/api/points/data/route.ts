// app/api/points/data/route.ts

import { NextResponse } from "next/server";
import PointsDataModel from "@/models/pointDataModel"; // Adjust the import path as necessary
import { connectDB } from "@/configs/db"; // Database connection helper

// Define the shape of your response data (optional but recommended)
interface PointData {
  data: {
    timestamp: Date;
    [key: string]: any; // Replace with actual structure of your point data
  };
  [key: string]: any; // Additional properties on your data model
}

export async function GET(req: Request): Promise<Response> {
  try {
    // Ensure database is connected
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const id = searchParams.get("id");

    // Validate timestamps
    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "startTime and endTime are required" },
        { status: 400 },
      );
    }

    // Convert timestamps to Date objects
    const startDate = new Date(parseInt(startTime, 10));
    const endDate = new Date(parseInt(endTime, 10));

    // Query the database for points between the specified time range
    const pointsData: PointData[] = await PointsDataModel.find({
      "data.clientId": id,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    // Return the response as JSON
    return NextResponse.json(pointsData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching point data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
