import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const buyers = await prisma.buyer.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(buyers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch buyers" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, action } = await req.json();

        let updateData = {};
        let logMessage = "";

        switch (action) {
            case "warn":
                updateData = { status: "warned" };
                logMessage = "Warned buyer";
                break;
            case "restrict":
                updateData = { status: "restricted" };
                logMessage = "Restricted buyer";
                break;
            case "restore":
                updateData = { status: "active", flagged: false, flagReason: null };
                logMessage = "Restored buyer";
                break;
            case "dismiss":
                updateData = { flagged: false, flagReason: null };
                logMessage = "Dismissed flag on buyer";
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const buyer = await prisma.buyer.update({
            where: { id },
            data: updateData,
        });

        // Log
        await prisma.activityLog.create({
            data: {
                action: action,
                entityType: "buyer",
                entityId: id,
                message: `${logMessage}: ${buyer.name}`
            }
        });

        return NextResponse.json(buyer);

    } catch (error) {
        console.error("Buyer Update Error:", error);
        return NextResponse.json({ error: "Failed to update buyer" }, { status: 500 });
    }
}
