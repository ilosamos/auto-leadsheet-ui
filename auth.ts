import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign-in: persist Google tokens into the JWT
      if (account) {
        // Create / sync the user in the backend (idempotent)
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
        try {
          await fetch(`${apiBase}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${account.id_token}`,
            },
            body: JSON.stringify({
              id: account.providerAccountId,
              email: user?.email ?? token.email,
              name: user?.name ?? token.name,
              image: user?.image ?? token.picture,
            }),
          })
        } catch (err) {
          console.error("Failed to create/sync user:", err)
        }

        return {
          ...token,
          idToken: account.id_token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        }
      }

      // Token has not expired yet — return as-is
      if (
        typeof token.expiresAt === "number" &&
        Date.now() < token.expiresAt * 1000 - 60_000
      ) {
        return token
      }

      // Token has expired (or is about to) — try to refresh
      if (!token.refreshToken) {
        return { ...token, error: "RefreshTokenError" as const }
      }

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.AUTH_GOOGLE_ID!,
            client_secret: process.env.AUTH_GOOGLE_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
          }),
        })

        const refreshed = await response.json()

        if (!response.ok) {
          throw new Error(refreshed.error ?? "Token refresh failed")
        }

        return {
          ...token,
          idToken: refreshed.id_token ?? token.idToken,
          accessToken: refreshed.access_token ?? token.accessToken,
          expiresAt: Math.floor(Date.now() / 1000) + (refreshed.expires_in as number),
          // Google only returns a new refresh_token when the user re-consents
          refreshToken: refreshed.refresh_token ?? token.refreshToken,
          error: undefined,
        }
      } catch (error) {
        console.error("Error refreshing token:", error)
        return { ...token, error: "RefreshTokenError" as const }
      }
    },

    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined
      session.error = token.error as string | undefined
      return session
    },
  },
})