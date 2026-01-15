import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log("Testing database connection...");

        // Try to find the supplier
        const supplier = await prisma.supplier.findUnique({
            where: { email: "supplier@example.com" }
        });

        if (supplier) {
            console.log("✅ Supplier found:", supplier.companyName);
            console.log("   Email:", supplier.email);
            console.log("   Status:", supplier.status);
        } else {
            console.log("❌ Supplier not found");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
