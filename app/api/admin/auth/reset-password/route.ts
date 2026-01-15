import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        // Verify Token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, type: string };
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        if (decoded.type !== "password_reset") {
            return NextResponse.json(
                { error: "Invalid token type" },
                { status: 400 }
            );
        }

        // Update Password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admin.update({
            where: { id: decoded.id },
            data: { password: hashedPassword }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "password_reset",
                entityType: "admin",
                entityId: decoded.id,
                message: "Admin password reset successfully",
                adminId: decoded.id
            }
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
