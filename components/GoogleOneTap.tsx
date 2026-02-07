"use client";

import { useEffect, useCallback } from "react";
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

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      await signIn("google-one-tap", {
        credential: response.credential,
        redirect: false,
      });
      router.refresh();
    },
    [router]
  );

  useEffect(() => {
    // Always load and initialize the GIS script (once),
    // so both auto-prompt and manual button trigger share the same instance.
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        // Use classic One Tap on localhost; enable FedCM in production
        use_fedcm_for_prompt:
          window.location.hostname !== "localhost",
        callback: handleCredentialResponse,
      });

      // Auto-prompt only when not signed in
      if (status === "unauthenticated") {
        window.google?.accounts.id.prompt();
      }
    };
    document.head.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      script.remove();
    };
  }, [status, handleCredentialResponse]);

  return null;
}
