import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    } else {
      await mongoose.connect(process.env.MONGO_URL!);
      console.log("Database connected successfully");
    }
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
