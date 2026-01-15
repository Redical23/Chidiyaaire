
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("supplier_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let supplierId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            supplierId = decoded.id;
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const data = await req.json();

        // Destructure allowed fields to prevent arbitrary updates
        const {
            companyName,
            phone,
            gstNumber,
            address,
            city,
            state,
            pincode,
            website,
            profileImage,
            description,
            categories,
            capacity,
            establishedYear,
            employeeCount,
            certifications
        } = data;

        const updatedSupplier = await prisma.supplier.update({
            where: { id: supplierId },
            data: {
                companyName,
                phone,
                gstNumber,
                address,
                city,
                state,
                pincode,
                website,
                profileImage,
                description,
                categories,
                capacity,
                establishedYear,
                employeeCount,
                certifications
            }
        });

        return NextResponse.json({
            success: true,
            supplier: updatedSupplier,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
