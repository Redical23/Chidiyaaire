import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to get supplier from token
async function getSupplierFromToken(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("supplier_token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        return decoded.id;
    } catch {
        return null;
    }
}

// GET - List all products for a supplier
export async function GET(request: NextRequest) {
    try {
        const supplierId = await getSupplierFromToken(request);

        if (!supplierId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const products = await prisma.product.findMany({
            where: {
                supplierId,
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
    try {
        const supplierId = await getSupplierFromToken(request);

        if (!supplierId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, category, description, priceRange, moq, leadTime, images } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Product name is required" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                supplierId,
                name,
                category: category || null,
                description: description || null,
                priceRange: priceRange || null,
                moq: moq || null,
                leadTime: leadTime || null,
                images: images || []
            }
        });

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}

// PUT - Update a product
export async function PUT(request: NextRequest) {
    try {
        const supplierId = await getSupplierFromToken(request);

        if (!supplierId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, name, category, description, priceRange, moq, leadTime, images, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existingProduct = await prisma.product.findFirst({
            where: { id, supplierId }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: name !== undefined ? name : existingProduct.name,
                category: category !== undefined ? category : existingProduct.category,
                description: description !== undefined ? description : existingProduct.description,
                priceRange: priceRange !== undefined ? priceRange : existingProduct.priceRange,
                moq: moq !== undefined ? moq : existingProduct.moq,
                leadTime: leadTime !== undefined ? leadTime : existingProduct.leadTime,
                images: images !== undefined ? images : existingProduct.images,
                isActive: isActive !== undefined ? isActive : existingProduct.isActive
            }
        });

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Failed to update product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a product (soft delete)
export async function DELETE(request: NextRequest) {
    try {
        const supplierId = await getSupplierFromToken(request);

        if (!supplierId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existingProduct = await prisma.product.findFirst({
            where: { id, supplierId }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Soft delete
        await prisma.product.update({
            where: { id },
            data: { isActive: false }
        });

        return NextResponse.json({
            success: true,
            message: "Product deleted"
        });
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
