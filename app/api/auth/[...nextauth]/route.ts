import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const { email, name } = user
                    if (!email) return false

                    // Upsert buyer in database
                    await prisma.buyer.upsert({
                        where: { email },
                        update: {
                            // Update name if not set, or update last active
                            lastActive: new Date(),
                        },
                        create: {
                            email,
                            name: name || email.split("@")[0],
                            status: "active",
                            // No password for Google users
                        }
                    })
                    return true
                } catch (error) {
                    console.error("Error saving user to DB", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, account, user }) {
            // Persist the user id to the token right after signin
            if (user && user.email) {
                // Fetch the database user ID
                const dbUser = await prisma.buyer.findUnique({
                    where: { email: user.email }
                })
                if (dbUser) {
                    token.id = dbUser.id
                }
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // @ts-expect-error adding accessToken to session
            session.accessToken = token.accessToken
            if (session.user && token.id) {
                // @ts-expect-error adding id to session user
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/account/login",
        error: "/account/login",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
