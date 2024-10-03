"use server";
import { Worker } from "worker_threads";
import PointsModel from "@/models/pointsModel";
import { connectDB } from "@/configs/db";

// Function to start a worker for a given point
const startPointWorker = async (pointId: string, frequency: number) => {
  connectDB();
  const point = await PointsModel.findById(pointId);
  if (!point) {
    throw new Error("Point not found");
  }

  const url = `http://localhost:${frequency === 5001 ? 5001 : 5000}`;
  const clientId = Math.random().toString(36).substr(2, 9);

  const worker = new Worker("./src/helper/clientWorker.js", {
    workerData: { url, clientId, data: ["frequency"] },
  });

  worker.on("message", async (msg) => {
    if (msg.status === "data") {
      console.log(`Received data from worker for ${point.name}:`, msg.data);
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "active", receivedData: msg.data },
      });
    } else if (msg.status === "error") {
      console.error(`Worker error for ${point.name}`);
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "error" },
      });
    }
  });

  worker.on("exit", async (code) => {
    if (code !== 0) {
      console.error(`Worker for ${point.name} exited with code ${code}`);
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "error" },
      });
    } else {
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "inactive" },
      });
    }
  });
};

export { startPointWorker };
