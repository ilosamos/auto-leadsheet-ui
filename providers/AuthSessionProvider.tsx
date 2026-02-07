"use client";

import { useEffect } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";

/**
 * Interval (in seconds) at which the SessionProvider polls
 * /api/auth/session.  Each poll triggers the server-side `jwt` callback,
 * which refreshes the Google tokens when they are close to expiry.
 *
 * 4 minutes is well within the ~60 s pre-expiry window used in auth.ts.
 */
const SESSION_REFETCH_INTERVAL_S = 4 * 60;

/**
 * Watches the session for auth errors (e.g. "RefreshTokenError") and
 * forces a sign-out so the user is shown the login prompt again.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      // Token expired and could not be refreshed — clear the broken session.
      // GoogleOneTap + Header will show the login prompt once status flips
      // to "unauthenticated".
      signOut({ redirect: false });
    }
  }, [session?.error]);

  return <>{children}</>;
}

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={SESSION_REFETCH_INTERVAL_S}
      refetchOnWindowFocus
    >
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
