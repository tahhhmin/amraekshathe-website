// src/app/api/projects/showprojectonmap/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Project from "@/models/Project"; // adjust path as needed

export async function GET() {
  try {
    await connectDB();

    // Fetch all projects, select only name and location fields
    const projects = await Project.find({}, "name location").lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    let message = "Failed to fetch projects";

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: string }).message === "string"
    ) {
      message = (error as { message: string }).message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
