import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                documents: true,
            }
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, action, badges } = await req.json();

        let updateData = {};
        let logMessage = "";

        if (action === "approve") {
            updateData = { status: "approved" };
            logMessage = `Approved supplier`;
        } else if (action === "suspend") {
            updateData = { status: "suspended" };
            logMessage = `Suspended supplier`;
        } else if (action === "restore") {
            updateData = { status: "approved" };
            logMessage = `Restored supplier`;
        } else if (action === "update_badges") {
            updateData = { badges };
            logMessage = `Updated badges`;
        }

        const supplier = await prisma.supplier.update({
            where: { id },
            data: updateData,
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: action,
                entityType: "supplier",
                entityId: id,
                message: `${logMessage}: ${supplier.companyName}`
            }
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.error("Supplier Update Error:", error);
        return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
    }
}
