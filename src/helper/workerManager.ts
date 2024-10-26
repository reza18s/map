/* eslint-disable no-console */
"use server";
import { Worker } from "worker_threads";
import PointsModel from "@/models/pointsModel";
import { connectDB } from "@/configs/db";
import PointsDataModel from "@/models/pointDataModel";

// Map to keep track of running workers
const workersMap: { [key: string]: Worker } = {};

// Function to start a worker for a given point
const startPointWorker = async (
  ip: string,
  pointId: string,
  port: number,
  data: string[] = [],
) => {
  // Check if the worker for the point is already running
  if (workersMap[pointId]) {
    console.log(`Worker for point ${pointId} is already running.`);
    return; // Exit the function if the worker is already running
  }

  connectDB();
  const point = await PointsModel.findById(pointId);
  if (!point) {
    throw new Error("Point not found");
  }

  const url = `http://${ip || "127.0.0.1"}:${port || 5000}`;

  const worker = new Worker("./src/helper/clientWorker.js", {
    workerData: { url, clientId: pointId, data: data },
  });

  workersMap[pointId] = worker; // Store worker in the map

  worker.on("message", async (msg) => {
    if (msg.status === "data") {
      console.log(`Received data from worker for ${point.name}:`, msg.data);
      const data = await PointsDataModel.create({
        data: msg.data,
      });
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "active", PointsData: data },
      });
    } else if (msg.status === "error") {
      console.error(`Worker error for ${point.name}`);
      await PointsModel.findByIdAndUpdate(pointId, {
        $set: { workerStatus: "error" },
      });
    }
  });

  worker.on("exit", async (code) => {
    delete workersMap[pointId]; // Remove the worker from the map
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

// Function to shut down a worker for a given point
const shutdownWorker = async (pointId: string) => {
  const worker = workersMap[pointId];
  if (!worker) {
    console.error("Worker not found for this point");
    return;
  }

  worker.terminate(); // Gracefully terminate the worker
  delete workersMap[pointId]; // Remove the worker from the map

  await PointsModel.findByIdAndUpdate(pointId, {
    $set: { workerStatus: "inactive" },
  });

  console.log(`Worker for point ${pointId} has been shut down`);
};

export { startPointWorker, shutdownWorker };
