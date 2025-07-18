// /config/connectDB.ts

import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
