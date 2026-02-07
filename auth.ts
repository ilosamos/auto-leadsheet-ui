import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { jwtVerify, createRemoteJWKSet } from "jose";

const googleJWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    Credentials({
      id: "google-one-tap",
      name: "Google One Tap",
      credentials: {
        credential: { type: "text" },
      },
      async authorize(credentials) {
        console.log("authorize", credentials);
        const idToken = credentials?.credential as string | undefined;
        if (!idToken) {
          return null;
        }

        try {
          const { payload } = await jwtVerify(idToken, googleJWKS, {
            issuer: "https://accounts.google.com",
            audience: process.env.AUTH_GOOGLE_ID,
          });

          return {
            id: payload.sub as string,
            name: payload.name as string,
            email: payload.email as string,
            image: payload.picture as string,
            idToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        // Google OAuth: id_token comes from the account
        if (account.provider === "google" && account.id_token) {
          token.idToken = account.id_token;
        }
        // Google One Tap: id token was attached to the user object
        if (
          account.provider === "google-one-tap" &&
          (user as Record<string, unknown>)?.idToken
        ) {
          token.idToken = (user as Record<string, unknown>).idToken as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      return session;
    },
  },
});
