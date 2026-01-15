import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { prisma } from "@/app/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value

        let userId

        // 1. Check Custom Auth Token
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
                userId = decoded.id
            } catch {
                // Token invalid, fall through to NextAuth check
            }
        }

        // 2. Check NextAuth Session if no custom token verified
        if (!userId) {
            const session = await getServerSession(authOptions)
            // @ts-ignore
            if (session?.user?.id) {
                // @ts-ignore
                userId = session.user.id
            } else if (session?.user?.email) {
                // Fallback if ID not in session for some reason
                const user = await prisma.buyer.findUnique({
                    where: { email: session.user.email }
                })
                userId = user?.id
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Find user in Buyer table
        const buyer = await prisma.buyer.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
            }
        })

        if (buyer) {
            return NextResponse.json({
                user: {
                    id: buyer.id,
                    email: buyer.email,
                    first_name: buyer.name,
                }
            })
        }

        return NextResponse.json({ error: "User not found" }, { status: 404 })

    } catch (error) {
        console.error("Auth me error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
