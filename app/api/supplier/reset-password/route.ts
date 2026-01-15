import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// POST: Reset password with token
export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
        }

        // Check token type
        if (decoded.type !== "password_reset") {
            return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
        }

        // Find supplier
        const supplier = await prisma.supplier.findUnique({
            where: { id: decoded.supplierId },
        });

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        await prisma.supplier.update({
            where: { id: supplier.id },
            data: { password: hashedPassword },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "password_reset_completed",
                entityType: "supplier",
                entityId: supplier.id,
                message: `Password reset completed for ${supplier.email}`
            }
        });

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully."
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
