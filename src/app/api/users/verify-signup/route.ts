// /api/users/verify-signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/sendMail";

function isValidEmail(email: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, code } = await req.json();

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: email and verification code" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate code format (assuming it's a string/number)
    if (typeof code !== "string" && typeof code !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid verification code format" },
        { status: 400 }
      );
    }

    // Case-insensitive search for user by email, include password and verification fields
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    })
    .select("+password +verifyToken +verifyTokenExpiry")
    .collation({ locale: "en", strength: 2 });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found with this email address" },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account is already verified" },
        { status: 400 }
      );
    }

    // Check if verification token exists
    if (!user.verifyToken) {
      return NextResponse.json(
        { success: false, message: "No verification code found. Please request a new one" },
        { status: 400 }
      );
    }

    // Check if verification code matches
    if (user.verifyToken !== code.toString()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if verification token has expired
    if (!user.verifyTokenExpiry || user.verifyTokenExpiry.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new one" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    // Send welcome email on successful verification
    try {
      await sendEmail("userSignupSuccess", {
        to: user.email,
        name: user.name || user.username,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the verification if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: "Account verified successfully! You can now log in",
      data: {
        userId: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        isVerified: user.isVerified,
        userType: user.userType,
      }
    });

  } catch (error: unknown) {
    console.error("Verification error:", error);
    
    const err = error as Error;
    
    // Handle specific MongoDB errors
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Invalid data provided during verification" },
        { status: 400 }
      );
    }
    
    if (err.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later" },
      { status: 500 }
    );
  }
}

// Additional route to resend verification code
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found with this email address" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification code and expiry
    const { generateVerificationToken, getVerificationTokenExpiry } = await import("@/utils/generateVerification");
    const newCode = generateVerificationToken();
    const newExpiry = getVerificationTokenExpiry();

    // Update user with new verification token
    user.verifyToken = newCode;
    user.verifyTokenExpiry = newExpiry;
    await user.save();

    // Send new verification email
    try {
      await sendEmail("userSignupCode", { 
        to: user.email, 
        code: newCode 
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send verification email. Please try again" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "New verification code sent to your email",
    });

  } catch (error: unknown) {
    console.error("Resend verification error:", error);
    
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later" },
      { status: 500 }
    );
  }
}