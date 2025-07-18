// /api/users/verify-signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/Users";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/sendMail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password, code } = await req.json();

    if (!email || !password || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.isVerified ||
      user.verifyToken !== code ||
      !user.verifyTokenExpiry ||
      user.verifyTokenExpiry < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    await sendEmail("userSignupSuccess", {
      to: email,
      name: user.username,
    });

    return NextResponse.json({
      success: true,
      message: "User verified and registered successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
