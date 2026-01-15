import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("supplier_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let supplierId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            supplierId = decoded.id;
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { gstNumber, panNumber, iecNumber, industry, otherLicenses, documents: docUrls } = await req.json();

        // Update supplier with KYC info
        await prisma.supplier.update({
            where: { id: supplierId },
            data: {
                gstNumber,
                panNumber,
            }
        });

        // Create document records
        const documents = [];

        if (gstNumber) {
            documents.push({
                supplierId,
                docType: "gst_certificate",
                fileName: "GST Certificate",
                fileUrl: docUrls?.gstCertificate || null,
                status: "pending"
            });
        }

        if (panNumber) {
            documents.push({
                supplierId,
                docType: "pan_card",
                fileName: "PAN Card",
                fileUrl: docUrls?.panCard || null,
                status: "pending"
            });
        }

        if (iecNumber) {
            documents.push({
                supplierId,
                docType: "iec_certificate",
                fileName: "IEC Certificate",
                fileUrl: docUrls?.iecCertificate || null,
                status: "pending"
            });
        }

        if (industry) {
            documents.push({
                supplierId,
                docType: "industry_license",
                fileName: `${industry} License`,
                fileUrl: docUrls?.industryLicense || null,
                status: "pending"
            });
        }

        // process each document with upsert logic
        for (const doc of documents) {
            const existingDoc = await prisma.supplierDocument.findFirst({
                where: {
                    supplierId: doc.supplierId,
                    docType: doc.docType
                }
            });

            if (existingDoc) {
                // Update existing document
                await prisma.supplierDocument.update({
                    where: { id: existingDoc.id },
                    data: {
                        fileName: doc.fileName,
                        fileUrl: doc.fileUrl,
                        status: "pending" // Reset status to pending on update
                    }
                });
            } else {
                // Create new document
                await prisma.supplierDocument.create({
                    data: doc
                });
            }
        }

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "kyc_submitted",
                entityType: "supplier",
                entityId: supplierId,
                message: `Supplier submitted KYC documents for verification`
            }
        });

        return NextResponse.json({ success: true, message: "KYC submitted successfully" });

    } catch (error) {
        console.error("Supplier Verify Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET: Check current verification status
export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("supplier_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let supplierId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            supplierId = decoded.id;
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
            select: {
                id: true,
                companyName: true,
                status: true,
                gstNumber: true,
                panNumber: true,
                documents: true
            }
        });

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        return NextResponse.json(supplier);

    } catch (error) {
        console.error("Supplier Status Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
