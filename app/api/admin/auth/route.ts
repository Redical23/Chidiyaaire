import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export async function POST(req: Request) {
    try {
        const { email, password, action } = await req.json();

        // Login
        if (action === "login") {
            const admin = await prisma.admin.findUnique({
                where: { email },
            });

            if (!admin) {
                // For security, don't reveal if user exists, but for now we'll be generic
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            const isValid = await bcrypt.compare(password, admin.password);

            if (!isValid) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            // Update last login
            await prisma.admin.update({
                where: { id: admin.id },
                data: { lastLogin: new Date() },
            });

            // Create token
            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            const response = NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });

            // Set cookie
            response.cookies.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400, // 1 day
                path: "/",
            });

            return response;
        }

        // Logout
        if (action === "logout") {
            const response = NextResponse.json({ success: true });
            response.cookies.delete("admin_token");
            return response;
        }

        // Register (Only for initial setup or super admin - protected in real app)
        // IMPORTANT: Remove or protect this in production
        if (action === "register_initial") {
            const count = await prisma.admin.count();
            if (count > 0) {
                return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = await prisma.admin.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: "Super Admin",
                    role: "super_admin"
                }
            });

            return NextResponse.json({ success: true, message: "Initial admin created" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Admin Auth Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
