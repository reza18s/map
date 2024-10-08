"use server";
import { parentPort, workerData } from "worker_threads";
import { io } from "socket.io-client";

const { url, clientId, data } = workerData;

const socket = io(url);
socket.on("connect", () => {
  console.log(`Connected to server at ${url}`);
  socket.emit("initial_data", { clientId, data });
});

socket.on("data_packet", (data) => {
  console.log(`Received data from ${url}:`, data);
  parentPort?.postMessage({ status: "data", data });
});

socket.on("error", (err) => {
  console.error(`Socket error on ${url}:`, err);
  parentPort?.postMessage({ status: "error", error: err });
});
