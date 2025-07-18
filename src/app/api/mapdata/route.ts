import { NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Location from "@/models/locationModel"; // Your Mongoose model

export async function GET() {
  try {
    await connectDB();
    const locations = await Location.find({}, "id name lat lng");
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
