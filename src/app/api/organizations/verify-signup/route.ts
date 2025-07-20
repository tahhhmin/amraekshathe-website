// api/organizations/verify-signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import Organization from "@/models/Organisation"; // Import the Organization model
import { sendEmail } from "@/utils/sendMail";
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification"; // For resend

// Type definitions
interface VerifyRequestBody {
  email: string;
  code: string | number;
}

interface ResendRequestBody {
  email: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

// POST handler for verifying organization signup
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const requestBody: VerifyRequestBody = await req.json();
    const { email, code } = requestBody;

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: email and verification code." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate code format
    if (typeof code !== "string" && typeof code !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid verification code format." },
        { status: 400 }
      );
    }

    // Find organization by email (case-insensitive) and select verification fields
    const organization = await Organization.findOne({ 
      email: email.toLowerCase() 
    })
    .select("+verifyToken +verifyTokenExpiry")
    .collation({ locale: "en", strength: 2 });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found with this email address." },
        { status: 404 }
      );
    }

    // Check if organization is already verified
    if (organization.isVerified) {
      return NextResponse.json(
        { success: false, message: "Organization account is already verified." },
        { status: 400 }
      );
    }

    // Check if verification token exists
    if (!organization.verifyToken) {
      return NextResponse.json(
        { success: false, message: "No verification code found for this organization. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if verification code matches
    if (organization.verifyToken !== code.toString()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }

    // Check if verification token has expired
    if (!organization.verifyTokenExpiry || organization.verifyTokenExpiry.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update organization verification status
    organization.isVerified = true;
    organization.verifyToken = undefined;
    organization.verifyTokenExpiry = undefined;

    await organization.save();

    // Send welcome email on successful verification
    try {
      await sendEmail("organizationSignupSuccess", {
        to: organization.email,
        organizationName: organization.organizationName,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email for organization:", emailError);
      // Log the error but don't fail the verification process
    }

    return NextResponse.json({
      success: true,
      message: "Organization account verified successfully! You can now log in.",
      data: {
        organizationId: organization._id,
        email: organization.email,
        organizationName: organization.organizationName,
        isVerified: organization.isVerified,
        userType: organization.userType, // Ensure userType is returned
      },
    });

  } catch (error: unknown) {
    console.error("Organization verification error:", error);
    
    const err = error as Error;
    
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: `Invalid data provided during organization verification: ${err.message}` },
        { status: 400 }
      );
    }
    
    if (err.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid organization ID format." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Internal server error during organization verification. Please try again later." },
      { status: 500 }
    );
  }
}

// PUT handler for resending verification code to organization
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const requestBody: ResendRequestBody = await req.json();
    const { email } = requestBody;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to resend verification code." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const organization = await Organization.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found with this email address." },
        { status: 404 }
      );
    }

    if (organization.isVerified) {
      return NextResponse.json(
        { success: false, message: "Organization account is already verified." },
        { status: 400 }
      );
    }

    // Generate new verification code and expiry
    const newCode = generateVerificationToken();
    const newExpiry = getVerificationTokenExpiry();

    // Update organization with new verification token
    organization.verifyToken = newCode;
    organization.verifyTokenExpiry = newExpiry;
    await organization.save();

    // Send new verification email
    try {
      await sendEmail("organizationSignupCode", { 
        to: organization.email, 
        code: newCode 
      });
    } catch (emailError) {
      console.error("Failed to send new verification email for organization:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send new verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "New verification code sent to your organization's email.",
    });

  } catch (error: unknown) {
    console.error("Resend organization verification error:", error);
    
    return NextResponse.json(
      { success: false, message: "Internal server error during resending organization verification code. Please try again later." },
      { status: 500 }
    );
  }
}
