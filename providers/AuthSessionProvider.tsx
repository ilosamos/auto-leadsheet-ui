"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { api } from "../app/client/api";
import type { UserResponse } from "../app/client/models/UserResponse";
import { UsersService } from "../app/client/services/UsersService";

/**
 * Interval (in seconds) at which the SessionProvider polls
 * /api/auth/session.  Each poll triggers the server-side `jwt` callback,
 * which refreshes the Google tokens when they are close to expiry.
 *
 * 3 minutes is well within the ~60 s pre-expiry window used in auth.ts.
 */
const SESSION_REFETCH_INTERVAL_S = 3 * 60;

type UserContextValue = {
  user: UserResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setFreeEligibleFalse: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

/**
 * Fetches the authenticated user from the API and provides it via context.
 * Must be used inside SessionProvider (and thus AuthSessionProvider).
 */
function UserProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (status !== "authenticated") {
      setUser(null);
      setIsLoading(status === "loading");
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    const { data, error: err } = await api(UsersService.getMeUsersMeGet());
    if (err) {
      setError(err);
      setUser(null);
    } else {
      setUser(data);
    }
    setIsLoading(false);
  }, [status]);

  const setFreeEligibleFalse = useCallback(() => {
    setUser((current) =>
      current ? { ...current, freeEligible: false } : current,
    );
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: UserContextValue = {
    user,
    isLoading,
    error,
    refetch: fetchUser,
    setFreeEligibleFalse,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("useUser must be used within AuthSessionProvider");
  }
  return ctx;
}

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

  return <UserProvider>{children}</UserProvider>;
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
