import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking for specific user in Supabase DB...\n");

    try {
        const email = "rishigupta9gupta@gmail.com";
        const supplier = await prisma.supplier.findUnique({
            where: { email },
        });

        if (supplier) {
            console.log("✅ Found supplier in Supabase DB:", supplier.email);
            console.log("User ID:", supplier.id);
        } else {
            console.log("❌ User NOT found in Supabase DB.");
            console.log("This confirms the user was created in the LOCAL database (localhost).");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
