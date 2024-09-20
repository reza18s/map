import mongoose from "mongoose";

let isConnected = false; // Track the database connection status

export const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URL!, {
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("Database connected");
    }
  } catch (err) {
    console.error("Database connection error:", err);
    throw err; // Ensure error bubbles up
  }
};
