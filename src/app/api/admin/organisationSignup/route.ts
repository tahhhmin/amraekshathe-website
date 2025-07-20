// app/api/organisations/signup/route.ts
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Organisation from "@/models/OrganisationSimplified"; // Adjust path if needed
import { connectDB } from "@/config/connectDB"; // Adjust path if needed

export async function POST(request: Request) {
    try {
        await connectDB(); // Ensure database connection

        const reqBody = await request.json();
        const { name, email, password, registrationNumber } = reqBody;

        // --- Basic Validation ---
        if (!name || !email || !password || !registrationNumber) {
            return NextResponse.json({
                success: false,
                message: "All fields are required: name, email, password, registration number",
            }, { status: 400 });
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({
                success: false,
                message: "Please enter a valid email address",
            }, { status: 400 });
        }

        // Validate password strength (minimum 8 characters)
        if (password.length < 8) {
            return NextResponse.json({
                success: false,
                message: "Password must be at least 8 characters long",
            }, { status: 400 });
        }

        // --- Check if organization already exists by email, name, or registration number ---
        const existingOrganisation = await Organisation.findOne({ $or: [{ email }, { name }, { registrationNumber }] });

        if (existingOrganisation) {
            let message = "An organization with similar details already exists.";
            if (existingOrganisation.email === email) {
                message = "An organization with this email already exists.";
            } else if (existingOrganisation.name === name) {
                message = "An organization with this name already exists.";
            } else if (existingOrganisation.registrationNumber === registrationNumber) {
                message = "An organization with this registration number already exists.";
            }
            return NextResponse.json({ success: false, message }, { status: 400 });
        }

        // --- Hash password ---
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // --- Create and save new organization ---
        const newOrganisation = new Organisation({
            name,
            email,
            password: hashedPassword,
            registrationNumber,
        });

        const savedOrganisation = await newOrganisation.save();
        console.log("Organisation saved:", savedOrganisation);

        return NextResponse.json({
            success: true,
            message: "Organisation account created successfully.",
            organisationId: savedOrganisation._id,
            organisationName: savedOrganisation.name,
            organisationEmail: savedOrganisation.email
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error during organisation signup:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}