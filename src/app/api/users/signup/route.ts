// /api/users/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification";
import { sendEmail } from "@/utils/sendMail";
import { connectDB } from "@/config/connectDB";
import User from "@/models/Users";
import bcrypt from "bcryptjs";

function isValidGender(g: any): g is "male" | "female" | "other" {
  return ["male", "female", "other"].includes(g);
}

function isValidUserType(t: any): t is "volunteer" | "organisation" {
  return ["volunteer", "organisation"].includes(t);
}

function isValidLocation(loc: any): boolean {
  if (!loc || typeof loc !== "object") return false;
  if (loc.type !== "Point") return false;
  if (!Array.isArray(loc.coordinates)) return false;
  if (loc.coordinates.length !== 2) return false;
  return loc.coordinates.every((c: any) => typeof c === "number" && c >= -180 && c <= 180);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
  return phoneRegex.test(phone);
}

function isValidUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      email,
      username,
      password,
      name,
      phoneNumber,
      dateOfBirth,
      gender,
      institution,
      educationLevel,
      address,
      location,
      userType = "volunteer", // Default to volunteer
    } = await req.json();

    // Validate all required fields
    if (
      !email ||
      !username ||
      !password ||
      !name ||
      !phoneNumber ||
      !dateOfBirth ||
      !gender ||
      !institution ||
      !educationLevel ||
      !address
    ) {
      return NextResponse.json(
        { success: false, message: "Missing one or more required fields." },
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

    // Validate username format
    if (!isValidUsername(username)) {
      return NextResponse.json(
        { success: false, message: "Username must be 3-30 characters and contain only letters, numbers, and underscores." },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    // Validate gender
    if (!isValidGender(gender)) {
      return NextResponse.json(
        { success: false, message: "Gender must be male, female, or other." },
        { status: 400 }
      );
    }

    // Validate user type
    if (!isValidUserType(userType)) {
      return NextResponse.json(
        { success: false, message: "User type must be volunteer or organisation." },
        { status: 400 }
      );
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid date of birth." },
        { status: 400 }
      );
    }

    // Check age (must be at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      return NextResponse.json(
        { success: false, message: "Age must be between 13 and 120 years." },
        { status: 400 }
      );
    }

    // Validate location if provided
    if (location && !isValidLocation(location)) {
      return NextResponse.json(
        { success: false, message: "Invalid location format. Must be GeoJSON Point with valid coordinates." },
        { status: 400 }
      );
    }

    // Check uniqueness of email (case insensitive)
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });
    
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already registered." },
        { status: 400 }
      );
    }

    // Check uniqueness of username (case insensitive)
    const existingUsername = await User.findOne({ 
      username: username.toLowerCase() 
    }).collation({ locale: "en", strength: 2 });
    
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Username is already taken." },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification code and expiry
    const code = generateVerificationToken();
    const expiry = getVerificationTokenExpiry();

    // Prepare user data
    const userData: any = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      dateOfBirth: birthDate,
      gender,
      institution: institution.trim(),
      educationLevel: educationLevel.trim(),
      address: address.trim(),
      verifyToken: code,
      verifyTokenExpiry: expiry,
      password: hashedPassword,
      userType,
      isVerified: false,
      isAdmin: false,
      dateJoined: new Date(),
      totalHoursVolunteered: 0,
      totalProjectsJoined: 0,
      impactScore: 0,
      certifications: [],
      milestones: [],
      organisations: [],
      currentlyWorkingProjects: [],
    };

    // Add location if provided
    if (location) {
      userData.location = location;
    }

    // Create new user document
    const newUser = await User.create(userData);

    // Send verification email with code
    try {
      await sendEmail("userSignupCode", { to: email, code });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the signup if email fails, but log it
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Verification code sent to your email.",
      data: {
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        userType: newUser.userType,
        isVerified: newUser.isVerified,
      }
    });

  } catch (error: unknown) {
    console.error("Signup error:", error);
    
    const err = error as Error;
    
    // Handle specific MongoDB errors
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Invalid data provided. Please check your input." },
        { status: 400 }
      );
    }
    
    if (err.message.includes("duplicate key")) {
      return NextResponse.json(
        { success: false, message: "Email or username already exists." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}