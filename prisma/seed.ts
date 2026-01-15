// Seed script to create initial data
// Run with: npx ts-node prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...\n");

    // Create initial admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.admin.upsert({
        where: { email: "admin@chidiyaai.com" },
        update: {},
        create: {
            email: "admin@chidiyaai.com",
            password: adminPassword,
            name: "Super Admin",
            role: "super_admin"
        }
    });

    // Create user requested super admin
    const rishiPassword = await bcrypt.hash("Rishi420", 10);
    const rishiAdmin = await prisma.admin.upsert({
        where: { email: "rishigupta9gupta@gmail.com" },
        update: {},
        create: {
            email: "rishigupta9gupta@gmail.com",
            password: rishiPassword,
            name: "Rishi Gupta",
            role: "super_admin"
        }
    });
    console.log("✅ Admin created:", admin.email);
    console.log("✅ Admin created:", rishiAdmin.email);

    // Create sample supplier
    const supplierPassword = await bcrypt.hash("supplier123", 10);
    const supplier = await prisma.supplier.upsert({
        where: { email: "supplier@example.com" },
        update: {},
        create: {
            email: "supplier@example.com",
            password: supplierPassword,
            companyName: "ABC Textiles Pvt Ltd",
            phone: "+91 98765 43210",
            gstNumber: "27AABCU9603R1ZM",
            productCategories: ["Textiles", "Fabrics", "Cotton"],
            capacity: "large",
            moq: "500 units",
            status: "approved",
            badges: ["gst", "verified"],
            address: "Industrial Area Phase 2",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            website: "https://abctextiles.com",
            description: "Leading manufacturer of premium quality textiles and fabrics since 1995.",
            categories: "Textiles, Fabrics, Cotton, Silk",
            establishedYear: "1995",
            employeeCount: "100-500",
            certifications: "ISO 9001, GOTS Certified"
        }
    });
    console.log("✅ Supplier created:", supplier.companyName);

    // Create sample products for supplier
    const product1 = await prisma.product.upsert({
        where: { id: "sample-product-1" },
        update: {},
        create: {
            id: "sample-product-1",
            supplierId: supplier.id,
            name: "Premium Cotton Fabric",
            category: "Textiles & Fabrics",
            description: "High-quality 100% cotton fabric, breathable and durable.",
            priceRange: "₹150-250/meter",
            moq: "500 meters",
            leadTime: "15-20 days",
            images: []
        }
    });

    const product2 = await prisma.product.upsert({
        where: { id: "sample-product-2" },
        update: {},
        create: {
            id: "sample-product-2",
            supplierId: supplier.id,
            name: "Silk Blend Fabric",
            category: "Textiles & Fabrics",
            description: "Luxurious silk blend fabric perfect for premium garments.",
            priceRange: "₹400-600/meter",
            moq: "200 meters",
            leadTime: "20-25 days",
            images: []
        }
    });
    console.log("✅ Products created: 2 products");

    // Create sample buyer
    const buyerPassword = await bcrypt.hash("buyer123", 10);
    const buyer = await prisma.buyer.upsert({
        where: { email: "buyer@example.com" },
        update: {},
        create: {
            email: "buyer@example.com",
            password: buyerPassword,
            name: "Rajesh Kumar",
            phone: "+91 87654 32100",
            companyName: "Fashion Hub Retail",
            status: "active"
        }
    });
    console.log("✅ Buyer created:", buyer.name);

    // Create sample category
    const category = await prisma.category.upsert({
        where: { slug: "textiles" },
        update: {},
        create: {
            name: "Textiles & Fabrics",
            slug: "textiles",
            description: "All types of textiles, fabrics, and raw materials"
        }
    });
    console.log("✅ Category created:", category.name);

    // Create sample inquiry
    const inquiry = await prisma.inquiry.create({
        data: {
            buyerId: buyer.id,
            supplierId: supplier.id,
            categoryId: category.id,
            product: "Cotton Fabric",
            description: "Looking for high-quality cotton fabric for summer collection",
            quantity: "5000 meters",
            budget: "₹5,00,000",
            timeline: "30 days",
            status: "new"
        }
    });
    console.log("✅ Inquiry created:", inquiry.product);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("   Admin: admin@chidiyaai.com / admin123");
    console.log("   Supplier: supplier@example.com / supplier123");
    console.log("   Buyer: buyer@example.com / buyer123");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
