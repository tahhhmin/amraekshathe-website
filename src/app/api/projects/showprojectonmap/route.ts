import { NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();

    // Fetch projects with only name and location
    const rawProjects = await Project.find({}, "name location").lean();

    // Filter to ensure valid GeoJSON Point with coordinates
    const projects = rawProjects.filter((project) => {
      return (
        project.location &&
        project.location.type === "Point" &&
        Array.isArray(project.location.coordinates) &&
        project.location.coordinates.length === 2 &&
        typeof project.location.coordinates[0] === "number" &&
        typeof project.location.coordinates[1] === "number"
      );
    });

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
