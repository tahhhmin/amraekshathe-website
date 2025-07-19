import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, coordinates, address } = body;

    // Basic validation
    if (!name || !coordinates || coordinates.length !== 2) {
      return NextResponse.json(
        { success: false, error: "Name and valid coordinates [longitude, latitude] are required." },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      name,
      location: {
        type: "Point",
        coordinates,
        address: address || "",
      },
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });

  } catch (error: any) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
