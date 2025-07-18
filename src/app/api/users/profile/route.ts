// /api/users/profile/route.ts

import { connectDB } from "@/config/connectDB";
import User from "@/models/Users";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getDataFromToken(req);

    const user = await User.findById(userId).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User profile fetched", data: user });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
