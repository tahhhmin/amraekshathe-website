import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, coordinates } = body;

    // Validate inputs
    if (
      typeof name !== "string" ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      !coordinates.every((coord) => typeof coord === "number")
    ) {
      return NextResponse.json(
        { success: false, error: "Name and valid coordinates [longitude, latitude] are required." },
        { status: 400 }
      );
    }

    // Create new project document
    const newProject = await Project.create({
      name: name.trim(),
      location: {
        type: "Point",
        coordinates,
      },
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create project:", error);

    let message = "Server error";
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as Record<string, unknown>).message === "string"
    ) {
      message = (error as { message: string }).message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
