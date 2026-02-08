"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

export function GoogleOneTap() {
  const { status } = useSession();
  const loadedRef = useRef(false);
  const [gsiReady, setGsiReady] = useState(false);

  // Load & initialize the GIS script exactly once.
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        // FedCM is not supported on localhost
        use_fedcm_for_prompt: window.location.hostname !== "localhost",
        callback: (response: { credential: string }) => {
          // Decode the JWT payload to extract the user's email so we can
          // pass it as login_hint — this pre-selects their account in the
          // OAuth consent screen, skipping the account chooser.
          try {
            const payload = JSON.parse(atob(response.credential.split(".")[1]));
            signIn("google", undefined, { login_hint: payload.email });
          } catch {
            signIn("google");
          }
        },
      });
      setGsiReady(true);
    };
    document.head.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
    };
  }, []);

  // Prompt whenever the GIS library is ready and the user is unauthenticated.
  // Because gsiReady is state (not a ref), this effect re-runs both when
  // the script finishes loading AND when the session status changes.
  useEffect(() => {
    if (gsiReady && status === "unauthenticated") {
      window.google?.accounts.id.prompt();
    }
  }, [gsiReady, status]);

  return null;
}
