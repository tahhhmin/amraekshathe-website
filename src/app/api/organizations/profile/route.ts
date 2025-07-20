// api/organizations/profile/route.ts
import { connectDB } from "@/config/connectDB";
import Organization from "@/models/Organisation"; // Import the Organization model
import { getDataFromToken } from "@/utils/getDataFromToken"; // Your existing utility
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // Import jwt to re-decode token

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get ID from the token using your provided utility
    const organizationId = getDataFromToken(req);

    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: "Authentication required: No valid token found." },
        { status: 401 }
      );
    }

    // Re-decode the token to get userType, as getDataFromToken only returns ID
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required: Token missing." },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return NextResponse.json(
        { success: false, message: "Server configuration error: JWT secret missing." },
        { status: 500 }
      );
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (jwtError: unknown) {
      console.error("JWT verification error in organization profile:", jwtError);
      return NextResponse.json(
        { success: false, message: "Invalid or expired authentication token." },
        { status: 401 }
      );
    }

    // Ensure the token's userType matches "organization"
    if (decodedToken.userType !== "organization") {
      return NextResponse.json(
        { success: false, message: "Access denied: Token is not for an organization." },
        { status: 403 }
      );
    }

    // Find the organization by ID, excluding sensitive fields
    const organization = await Organization.findById(organizationId).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Organization profile fetched successfully.", 
      success: true,
      data: {
        id: organization._id,
        email: organization.email,
        organizationName: organization.organizationName,
        contactPerson: organization.contactPerson,
        phoneNumber: organization.phoneNumber,
        address: organization.address,
        isVerified: organization.isVerified,
        dateJoined: organization.dateJoined,
        userType: organization.userType, // Ensure userType is returned
      }
    });

  } catch (error: unknown) {
    console.error("Organization profile fetch error:", error);
    const err = error as Error;
    
    // Handle specific errors from getDataFromToken or database
    if (err.message.includes("Authentication required") || err.message.includes("Invalid or expired token")) {
      return NextResponse.json(
        { success: false, message: "Authentication required or token is invalid/expired." },
        { status: 401 } // Unauthorized
      );
    }
    if (err.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json(
        { success: false, message: "Invalid organization ID format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while fetching organization profile." },
      { status: 500 }
    );
  }
}
