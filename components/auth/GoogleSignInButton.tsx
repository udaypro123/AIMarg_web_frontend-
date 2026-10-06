"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Box } from "@mui/material";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: {
          theme: "outline";
          size: "large";
          text: "signin_with" | "signup_with";
          shape: "pill";
          width: number;
        }
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

export function GoogleSignInButton({
  disabled,
  mode,
  onCredential,
  onError,
}: {
  disabled: boolean;
  mode: "signin" | "signup";
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonRef = useRef<HTMLDivElement>(null);
  const credentialHandler = useRef(onCredential);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    credentialHandler.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => credentialHandler.current(credential),
    });
    buttonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: mode === "signup" ? "signup_with" : "signin_with",
      shape: "pill",
      width: Math.min(buttonRef.current.clientWidth || 340, 340),
    });
  }, [clientId, mode, scriptReady]);

  if (!clientId) {
    const label = mode === "signup" ? "Sign up with Google" : "Sign in with Google";
    return (
      <Box
        component="button"
        type="button"
        onClick={() => onError("Google sign-in needs NEXT_PUBLIC_GOOGLE_CLIENT_ID configured in AIMarg_frontend/.env.local.")}
        sx={{
          minHeight: 46,
          border: "1.5px solid #858585",
          borderRadius: "999px",
          backgroundColor: "#fff",
          color: "#1f1f1f",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span aria-hidden="true" style={{ color: "#4285F4", marginRight: 10, fontSize: 18 }}>G</span>
        {label}
      </Box>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <Box
        ref={buttonRef}
        aria-disabled={disabled}
        sx={{
          display: "flex",
          justifyContent: "center",
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.6 : 1,
          "& > div": { maxWidth: "100%" },
        }}
      />
    </>
  );
}
