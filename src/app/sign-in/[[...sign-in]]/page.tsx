"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Background gradient that matches the sign‑in card */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-[#101726]" />
      
      {/* Centered container for the Clerk sign‑in */}
      <div className="relative z-10 w-[460px] max-w-[95vw]">
        <div className="overflow-hidden rounded-2xl">
          <SignIn
            appearance={{
              elements: {
                // Force the container to exactly fill the parent container.
                rootBox: {
                  width: "100%",
                  margin: "0 auto",
                },
                // The card styling: plain background, no extra borders or shadows.
                card: {
                  width: "100%",
                  backgroundColor: "#101726",
                  border: "none",
                  boxShadow: "none",
                },
                // Hide the development banner if present.
                devEnvironmentBanner: {
                  display: "none",
                },
                // Header styling: show title in the center.
                headerTitle: {
                  fontSize: "24px",
                  fontWeight: "700",
                  textAlign: "center",
                  color: "white",
                  marginTop: "16px",
                },
                // Optionally hide any subtitle.
                headerSubtitle: {
                  display: "none",
                },
                // The form container that holds inputs/buttons.
                form: {
                  width: "100%",
                  padding: "0 32px",
                  margin: "0 auto",
                },
                // Hide the email label so the placeholder is the only cue.
                formFieldLabel: {
                  display: "none",
                },
                // Input styling.
                formFieldInput: {
                  backgroundColor: "#1a202c",
                  color: "white",
                  border: "1px solid #2c3a4d",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  width: "100%",
                },
                // Primary button styling.
                formButtonPrimary: {
                  backgroundColor: "#1d4ed8",
                  color: "white",
                  borderRadius: "6px",
                  padding: "14px 16px",
                  width: "100%",
                  marginTop: "6px",
                  marginBottom: "16px",
                  display: "block",
                },
                // Hide the footer if you don't need it.
                footer: {
                  display: "none",
                },
              },
              layout: {
                // If you have any social buttons, place them at the bottom.
                socialButtonsPlacement: "bottom",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
