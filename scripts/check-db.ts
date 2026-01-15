// Script to check database connection and data
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔌 Checking database connection...\n");

    try {
        // Test connection
        await prisma.$connect();
        console.log("✅ Database connected successfully!\n");

        // Check Admins
        const admins = await prisma.admin.findMany();
        console.log(`📋 ADMINS (${admins.length} records):`);
        admins.forEach((admin) => {
            console.log(`   - ${admin.email} (${admin.role})`);
        });
        console.log();

        // Check Suppliers
        const suppliers = await prisma.supplier.findMany({
            include: { products: true }
        });
        console.log(`🏭 SUPPLIERS (${suppliers.length} records):`);
        suppliers.forEach((supplier) => {
            console.log(`   - ${supplier.companyName} (${supplier.email}) - Status: ${supplier.status}, Products: ${supplier.products?.length || 0}`);
        });
        console.log();

        // Check Buyers
        const buyers = await prisma.buyer.findMany();
        console.log(`🛒 BUYERS (${buyers.length} records):`);
        buyers.forEach((buyer) => {
            console.log(`   - ${buyer.name} (${buyer.email}) - Status: ${buyer.status}`);
        });
        console.log();

        // Check Inquiries
        const inquiries = await prisma.inquiry.findMany();
        console.log(`📬 INQUIRIES (${inquiries.length} records):`);
        inquiries.forEach((inquiry) => {
            console.log(`   - ${inquiry.product} - Qty: ${inquiry.quantity} - Status: ${inquiry.status}`);
        });
        console.log();

        // Check Quotes
        const quotes = await prisma.quote.findMany();
        console.log(`💰 QUOTES (${quotes.length} records):`);
        quotes.forEach((quote) => {
            console.log(`   - Price: ${quote.price} - Status: ${quote.status}`);
        });
        console.log();

        // Check Products
        const products = await prisma.product.findMany();
        console.log(`📦 PRODUCTS (${products.length} records):`);
        products.forEach((product) => {
            console.log(`   - ${product.name} (${product.category}) - MOQ: ${product.moq}, Price: ${product.priceRange}`);
        });
        console.log();

        // Check Categories
        const categories = await prisma.category.findMany();
        console.log(`🏷️ CATEGORIES (${categories.length} records):`);
        categories.forEach((category) => {
            console.log(`   - ${category.name} (${category.slug})`);
        });
        console.log();

        console.log("✅ Database check complete!");

    } catch (error) {
        console.error("❌ Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
