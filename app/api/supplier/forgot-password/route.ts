import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// POST: Request password reset
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Find supplier by email
        const supplier = await prisma.supplier.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!supplier) {
            return NextResponse.json({
                success: true,
                message: "If an account with that email exists, a reset link has been sent."
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // We'll store it in the database - need to add fields to schema or use a simple approach
        // For now, we'll create a signed token with JWT
        const jwt = require("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

        const token = jwt.sign(
            {
                supplierId: supplier.id,
                email: supplier.email,
                type: "password_reset"
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Create reset link
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
        const resetLink = `${baseUrl}/supplier/reset-password?token=${token}`;

        // Send email
        try {
            await transporter.sendMail({
                from: `"ChidiyaAI" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Reset Your Supplier Portal Password",
                html: `
                    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h1 style="font-size: 24px; color: #0f172a; margin: 0;">
                                Chidiya<span style="color: #3b82f6;">AI</span>
                            </h1>
                            <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Supplier Portal</p>
                        </div>
                        
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
                            <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 16px 0;">
                                Password Reset Request
                            </h2>
                            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                                Hello <strong>${supplier.companyName}</strong>,<br><br>
                                We received a request to reset your password. Click the button below to create a new password.
                            </p>
                            <a href="${resetLink}" style="display: inline-block; background-color: #0f172a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            This link will expire in 1 hour. If you didn't request this, please ignore this email.
                        </p>
                        
                        <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 24px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                © 2025 ChidiyaAI. All rights reserved.
                            </p>
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error("Email send error:", emailError);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "password_reset_requested",
                entityType: "supplier",
                entityId: supplier.id,
                message: `Password reset requested for ${supplier.email}`
            }
        });

        return NextResponse.json({
            success: true,
            message: "If an account with that email exists, a reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
