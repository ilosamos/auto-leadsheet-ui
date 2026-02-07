import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { jwtVerify, createRemoteJWKSet, SignJWT } from "jose";

const googleJWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

/** How long server-minted JWTs for One Tap sessions are valid (seconds). */
const BACKEND_TOKEN_EXPIRY_SEC = 7 * 24 * 3600; // 7 days

/**
 * Create a server-signed JWT that replaces the short-lived Google One Tap
 * ID token.  Signed with AUTH_SECRET so the backend can validate it with the
 * same shared secret.  The JWT carries the same user claims as the original
 * Google ID token.
 */
async function signBackendJwt(claims: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
  const expiresAt = Math.floor(Date.now() / 1000) + BACKEND_TOKEN_EXPIRY_SEC;

  const jwt = await new SignJWT({
    email: claims.email,
    name: claims.name,
    picture: claims.picture,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuer("auto-leadsheet-ui")
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);

  return { jwt, expiresAt };
}

/**
 * Refresh the Google OAuth tokens using the stored refresh_token.
 * Returns an updated partial token object on success, or an error flag.
 */
async function refreshGoogleToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error("Failed to refresh Google token:", data);
    return { error: "RefreshTokenError" as const };
  }

  return {
    idToken: data.id_token as string,
    accessToken: data.access_token as string,
    // Google returns expires_in in seconds; convert to absolute timestamp
    expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in as number),
    // Google only returns a new refresh_token if the previous one was revoked
    refreshToken: (data.refresh_token as string | undefined) ?? refreshToken,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
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
      // --- Initial sign-in: persist tokens from the provider ----------
      if (account) {
        // Clear any stale error from a previous session
        delete token.error;

        if (account.provider === "google") {
          token.idToken = account.id_token;
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at; // seconds since epoch
          token.provider = "google";
        }

        if (
          account.provider === "google-one-tap" &&
          (user as Record<string, unknown>)?.idToken
        ) {
          // Replace the short-lived Google ID token with a server-signed JWT
          // that carries the same claims but is long-lived and can be
          // re-signed on expiry (no Google refresh token needed).
          const signed = await signBackendJwt({
            sub: user.id!,
            email: user.email!,
            name: user.name!,
            picture: user.image ?? undefined,
          });
          token.idToken = signed.jwt;
          token.expiresAt = signed.expiresAt;
          token.provider = "google-one-tap";
        }

        return token;
      }

      // --- Subsequent requests: refresh if expired --------------------
      const expiresAt = token.expiresAt as number | undefined;

      // If expiresAt was never set, the token state is broken — treat as
      // expired so the user is prompted to re-authenticate.
      if (!expiresAt) {
        // eslint-disable-next-line no-console
        console.warn("Token has no expiresAt — treating as expired");
        return { ...token, error: "RefreshTokenError" };
      }

      const nowSec = Math.floor(Date.now() / 1000);
      const isExpired = nowSec >= expiresAt - 60; // refresh 60 s before expiry

      if (!isExpired) {
        return token;
      }

      // One Tap: re-sign a fresh backend JWT (no Google refresh token needed)
      if (token.provider === "google-one-tap") {
        const signed = await signBackendJwt({
          sub: token.sub as string,
          email: token.email as string,
          name: token.name as string,
          picture: token.picture as string | undefined,
        });
        return {
          ...token,
          idToken: signed.jwt,
          expiresAt: signed.expiresAt,
          error: undefined,
        };
      }

      // Full OAuth flow: refresh via Google
      const refreshToken = token.refreshToken as string | undefined;
      if (!refreshToken) {
        // eslint-disable-next-line no-console
        console.warn(
          `ID token expired and no refresh token available (provider: ${token.provider ?? "unknown"})`,
        );
        return { ...token, error: "RefreshTokenError" };
      }

      const refreshed = await refreshGoogleToken(refreshToken);

      if ("error" in refreshed) {
        return { ...token, error: refreshed.error };
      }

      // Success — update tokens and clear any previous error
      return {
        ...token,
        idToken: refreshed.idToken,
        accessToken: refreshed.accessToken,
        expiresAt: refreshed.expiresAt,
        refreshToken: refreshed.refreshToken,
        error: undefined,
      };
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      // Surface refresh errors so the client can react (force re-login)
      session.error = token.error as string | undefined;
      return session;
    },
  },
});
