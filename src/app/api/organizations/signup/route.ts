// api/organizations/signup/route.ts
// This file handles the signup (registration) process for new organizations.

import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification";
import { sendEmail } from "@/utils/sendMail";
import { connectDB } from "@/config/connectDB";
import Organization, { IOrganization } from "@/models/Organisation"; // Import the Organization model
import bcrypt from "bcryptjs";

// Type definitions for request body
interface SignupRequestBody {
  email: string;
  password: string;
  organizationName: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
}

// Helper functions for validation (can be moved to a separate utils file if preferred)
function isValidEmail(email: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
  return phoneRegex.test(phone);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const requestBody: SignupRequestBody = await req.json();
    const {
      email,
      password,
      organizationName,
      contactPerson,
      phoneNumber,
      address,
    } = requestBody;

    // 1. Validate all required fields
    if (
      !email ||
      !password ||
      !organizationName ||
      !contactPerson ||
      !phoneNumber ||
      !address
    ) {
      return NextResponse.json(
        { success: false, message: "Missing one or more required fields for organization signup." },
        { status: 400 }
      );
    }

    // 2. Validate formats
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid primary email address for the organization." },
        { status: 400 }
      );
    }
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid phone number for the organization." },
        { status: 400 }
      );
    }

    // 3. Check uniqueness of email and organization name
    // Using .collation for case-insensitive unique checks
    const existingOrgByEmail = await Organization.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });
    
    if (existingOrgByEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already registered by another organization." },
        { status: 400 }
      );
    }

    const existingOrgByName = await Organization.findOne({ 
      organizationName: organizationName.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });
    
    if (existingOrgByName) {
      return NextResponse.json(
        { success: false, message: "Organization name is already taken. Please choose a different one." },
        { status: 400 }
      );
    }

    // 4. Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Generate verification code and its expiry time
    const code = generateVerificationToken();
    const expiry = getVerificationTokenExpiry();

    // 6. Prepare organization data for creation
    const organizationData: IOrganization = {
      email: email.toLowerCase(),
      password: hashedPassword,
      organizationName: organizationName.trim(),
      contactPerson: contactPerson.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      
      isVerified: false, // New organizations are not verified by default
      dateJoined: new Date(), // Record the date of signup
      
      verifyToken: code, // Store the verification code
      verifyTokenExpiry: expiry, // Store the expiry for the code
      userType: "organization", // Explicitly set user type for this model
    } as IOrganization; // Cast to IOrganization to satisfy type checking

    // 7. Create the new organization document in the database
    const newOrganization = await Organization.create(organizationData);

    // 8. Send verification email to the organization's email address
    try {
      await sendEmail("organizationSignupCode", { to: email, code });
    } catch (emailError) {
      console.error("Failed to send verification email for organization:", emailError);
      // Log the error but don't fail the signup process if email sending fails
      // The organization can still request a resend later.
    }

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Organization account created successfully. Verification code sent to your primary email.",
      data: {
        organizationId: newOrganization._id,
        email: newOrganization.email,
        organizationName: newOrganization.organizationName,
        isVerified: newOrganization.isVerified,
      },
    });

  } catch (error: unknown) {
    console.error("Organization signup error:", error);
    
    const err = error as Error;
    
    // Handle specific MongoDB validation errors (e.g., if a field doesn't match schema)
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: `Invalid data provided: ${err.message}` },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors (e.g., email or organizationName already exists)
    if (err.message.includes("duplicate key") || err.message.includes("E11000 duplicate key error")) {
      return NextResponse.json(
        { success: false, message: "An organization with this email or name already exists." },
        { status: 400 }
      );
    }
    
    // Catch any other unexpected errors
    return NextResponse.json(
      { success: false, message: "Internal server error during organization signup. Please try again later." },
      { status: 500 }
    );
  }
}
