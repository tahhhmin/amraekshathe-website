// api/organizations/login/route.ts
import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Organization from "@/models/Organisation"; // Import the Organization model
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: email and password." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Find organization by email and explicitly select password field
    const organization = await Organization.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials: Organization not found." },
        { status: 400 }
      );
    }

    // Check if organization is verified
    if (!organization.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your organization's email before logging in." },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, organization.password || ''); // Handle optional password
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials: Incorrect password." },
        { status: 400 }
      );
    }

    // Check if JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return NextResponse.json(
        { success: false, message: "Server configuration error: JWT secret missing." },
        { status: 500 }
      );
    }

    // Create JWT token for the organization - IMPORTANT: Added userType to the payload
    const token = jwt.sign(
      { 
        id: organization._id.toString(),
        email: organization.email,
        organizationName: organization.organizationName,
        userType: organization.userType // Include userType in the token
      },
      jwtSecret,
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    // Create response object
    const response = NextResponse.json({
      message: "Organization logged in successfully.",
      success: true,
      organization: {
        id: organization._id,
        email: organization.email,
        organizationName: organization.organizationName,
        contactPerson: organization.contactPerson,
        userType: organization.userType, // Also return userType in the response body
      }
    });

    // Set HTTP-only cookie for the token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax", // Protect against CSRF attacks
      path: "/", // Available across the entire site
      maxAge: 86400, // 24 hours in seconds
    });

    return response;

  } catch (error: unknown) {
    console.error("Organization login error:", error);
    
    if (error instanceof Error) {
      // Handle specific MongoDB errors or validation errors
      if (error.message.includes('Cast to ObjectId failed')) {
        return NextResponse.json(
          { success: false, message: "Invalid organization data format." },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: `Organization login failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during organization login." },
      { status: 500 }
    );
  }
}
