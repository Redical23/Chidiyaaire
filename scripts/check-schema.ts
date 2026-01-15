import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking database schema...\n");

    try {
        // Try to query a supplier
        const result = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'suppliers'
            ORDER BY ordinal_position;
        `;
        console.log("📋 Suppliers table columns:");
        console.log(result);

        // Check if there are any suppliers
        const suppliers = await prisma.supplier.findMany({ take: 1 });
        console.log("\n📦 Sample supplier:", suppliers[0] || "No suppliers found");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
