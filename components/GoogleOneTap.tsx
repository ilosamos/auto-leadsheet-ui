"use client";

import { useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

/**
 * Trigger the Google One Tap / GIS prompt manually.
 * Can be called from any component (e.g. Header sign-in button).
 */
export function triggerGooglePrompt() {
  window.google?.accounts.id.prompt();
}

export function GoogleOneTap() {
  const { status } = useSession();
  const router = useRouter();
  const initializedRef = useRef(false);

  // Load & initialize the GIS script exactly once.
  useEffect(() => {
    if (initializedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: window.location.hostname !== "localhost",
        callback: async (response: { credential: string }) => {
          await signIn("google-one-tap", {
            credential: response.credential,
            redirect: false,
          });
          router.refresh();
        },
      });
      initializedRef.current = true;

      // Auto-prompt if the user isn't signed in at load time
      if (status === "unauthenticated") {
        window.google?.accounts.id.prompt();
      }
    };
    document.head.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once
  }, []);

  // If the user signs out after the script was already loaded, auto-prompt again.
  useEffect(() => {
    if (initializedRef.current && status === "unauthenticated") {
      window.google?.accounts.id.prompt();
    }
  }, [status]);

  return null;
}
