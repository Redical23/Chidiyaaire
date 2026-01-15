import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        // Parallelize queries for performance
        const [
            pendingSuppliers,
            totalSuppliers,
            flaggedBuyers,
            recentActivity,
            aiAlerts
        ] = await Promise.all([
            prisma.supplier.count({ where: { status: "pending" } }),
            prisma.supplier.count(),
            prisma.buyer.count({ where: { flagged: true } }),
            prisma.activityLog.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
            }),
            prisma.aIAlert.findMany({
                where: { status: "active" },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        // Calculate 'Inquiries' count (mock logic for now if no Inquiry model interaction in dashboard yet, 
        // or fetch real count if needed. Let's fetch real count of recent inquiries)
        const recentInquiriesCount = await prisma.inquiry.count({
            where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Last 7 days
        });

        return NextResponse.json({
            stats: {
                pendingSuppliers,
                totalSuppliers,
                flaggedBuyers,
                recentInquiries: recentInquiriesCount
            },
            recentActivity,
            aiAlerts
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
