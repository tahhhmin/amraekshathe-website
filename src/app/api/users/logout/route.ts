// /api/users/logout/route.ts

import { connectDB } from "@/config/connectDB";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // Forces immediate expiration
    });

    return response;
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
