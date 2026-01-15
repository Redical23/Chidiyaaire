import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// SMTP Configuration
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465, // True for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        // Always return success to prevent email enumeration
        if (!admin) {
            console.log(`[Forgot Password] Email ${email} not found.`);
            return NextResponse.json({ success: true, message: "If account exists, email sent." });
        }

        // Generate reset token (short lived: 15 mins)
        const token = jwt.sign(
            { id: admin.id, email: admin.email, type: "password_reset" },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        const resetLink = `${APP_URL}/admin/reset-password?token=${token}`;

        // Send Email
        try {
            if (!process.env.SMTP_USER) {
                console.log("=================================================");
                console.log("SMTP Credentials missing. Logging reset link:");
                console.log(`Reset Link for ${email}: ${resetLink}`);
                console.log("=================================================");
            } else {
                await transporter.sendMail({
                    from: process.env.SMTP_FROM || '"ChidiyaAI Admin" <noreply@chidiyaai.com>',
                    to: email,
                    subject: "Password Reset Request",
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Password Reset Request</h2>
                            <p>You requested a password reset for your ChidiyaAI Admin account.</p>
                            <p>Click the link below to verify your email and set a new password:</p>
                            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
                            <p style="margin-top: 20px; color: #666; font-size: 12px;">This link will expire in 15 minutes.</p>
                            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                        </div>
                    `
                });
                console.log(`[Forgot Password] Email sent to ${email}`);
            }
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // Still return success to user
        }

        return NextResponse.json({ success: true, message: "If account exists, email sent." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
