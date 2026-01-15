import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Check if user is authenticated
async function getAuthStatus() {
    // 1. Check Custom Cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (token) return true

    // 2. Check NextAuth Session
    const session = await getServerSession(authOptions)
    if (session?.user) return true

    return false
}

export default async function AccountPage() {
    const isLoggedIn = await getAuthStatus()

    // If logged in, redirect to chat
    if (isLoggedIn) {
        redirect("/account/chat")
    }

    // If not logged in, redirect to login page
    redirect("/account/login")
}
