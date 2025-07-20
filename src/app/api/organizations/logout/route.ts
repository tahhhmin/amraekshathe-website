// api/organizations/logout/route.ts
import { connectDB } from "@/config/connectDB";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    const response = NextResponse.json({
      message: "Organization logged out successfully",
      success: true,
    });

    // Clear the authentication token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // Forces immediate expiration
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    console.error("Organization logout error:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: `Logout failed: ${err.message}` },
      { status: 500 }
    );
  }
}
