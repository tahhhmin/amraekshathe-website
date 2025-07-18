// /api/users/logout/route.ts

import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest) {
    try {
        await connectDB();

        const response = NextResponse.json({ message: "Logged out successfully", success: true });
        response.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}