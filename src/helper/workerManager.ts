/* eslint-disable no-console */
"use server";
import { Worker } from "worker_threads";
import PointsModel from "@/models/pointsModel";
import { connectDB } from "@/configs/db";

// Map to keep track of running workers
const workersMap = new Map();

// Function to start a worker for a given point
const startPointWorker = async (pointId: string, frequency: number) => {
  // Check if the worker for the point is already running
  if (workersMap.has(pointId)) {
    console.log(`Worker for point ${pointId} is already running.`);
    return; // Exit the function if the worker is already running
  }

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

  workersMap.set(pointId, worker); // Store worker in the map

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
    workersMap.delete(pointId); // Remove the worker from the map
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
  const worker = workersMap.get(pointId);
  if (!worker) {
    throw new Error("Worker not found for this point");
  }

  worker.terminate(); // Gracefully terminate the worker
  workersMap.delete(pointId); // Remove the worker from the map

  await PointsModel.findByIdAndUpdate(pointId, {
    $set: { workerStatus: "inactive" },
  });

  console.log(`Worker for point ${pointId} has been shut down`);
};

export { startPointWorker, shutdownWorker };
