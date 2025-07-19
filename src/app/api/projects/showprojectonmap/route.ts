// src/app/api/projects/showprojectonmap/route.ts


import { NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Project from "@/models/Project";    // adjust path as needed

export async function GET() {
  try {
    await connectDB();

    // Fetch all projects, select only name and location fields
    const projects = await Project.find({}, "name location").lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
