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
        if (!email || !password) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
        return NextResponse.json({ success: false, message: "User not found or not verified" }, { status: 400 });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 });
        }

        const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
        );

        const response = NextResponse.json({ message: "Logged in successfully", success: true });
        response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 86400,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}