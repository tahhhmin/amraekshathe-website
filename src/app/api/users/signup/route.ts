// /api/users/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification";
import { sendEmail } from "@/utils/sendMail";
import { connectDB } from "@/config/connectDB";
import User from "@/models/Users";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
        }

        const code = generateVerificationToken();
        const expiry = getVerificationTokenExpiry();

        await User.create({ email, username, password, verifyToken: code, verifyTokenExpiry: expiry });

        await sendEmail("userSignupCode", { to: email, code });

        return NextResponse.json({ success: true, message: "Verification code sent to your email" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}