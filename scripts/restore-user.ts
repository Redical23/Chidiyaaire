import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Log the database we are connecting to (security safe)
    const dbUrl = process.env.DATABASE_URL || "";
    const hostname = dbUrl.split("@")[1]?.split(":")[0] || "unknown";
    console.log(`🔌 Connecting to database host: ${hostname}\n`);

    const email = "rishigupta9gupta@gmail.com";
    const password = "Rishi420";

    console.log(`Checking for user: ${email}...`);

    const existing = await prisma.supplier.findUnique({
        where: { email },
    });

    if (existing) {
        console.log("✅ User already exists in this database.");
        return;
    }

    console.log("⚠️ User not found. Creating account...");

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create supplier without the invalid 'country' field
    const supplier = await prisma.supplier.create({
        data: {
            email,
            password: hashedPassword,
            companyName: "Rishi Enterprises",
            phone: "+91 98765 43210",
            productCategories: ["Textiles"], // Array
            status: "approved",
            address: "New Delhi, India",
            city: "New Delhi",
            state: "Delhi",
            pincode: "110001"
        },
    });

    console.log(`✅ User created successfully!`);
    console.log(`Email: ${supplier.email}`);
    console.log(`Status: ${supplier.status}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
