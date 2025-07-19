// /api/users/login/route.ts

import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before logging in" },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check if JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        userType: user.userType
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Create response
    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        userType: user.userType
      }
    });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 hours in seconds
    });

    return response;

  } catch (error: unknown) {
    console.error("Login error:", error);
    
    if (error instanceof Error) {
      // Handle specific MongoDB errors
      if (error.message.includes('Cast to ObjectId failed')) {
        return NextResponse.json(
          { success: false, message: "Invalid user data" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: "Login failed. Please try again." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}