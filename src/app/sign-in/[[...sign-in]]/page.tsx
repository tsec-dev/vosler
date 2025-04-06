"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
      {/* Simple dark blue to black background (ends in #101726 to match card) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-[#101726]" />

      {/* Your container (460px wide) */}
      <div className="w-[460px] max-w-[95vw] z-10">
        {/* Remove any extra border or background so Clerk card is the only box */}
        <div className="overflow-hidden rounded-2xl">
          <SignIn
            appearance={{
              elements: {
                // 1) Make the root box & card fill the parent container
                rootBox: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                },
                card: {
                  width: "100%",
                  maxWidth: "100%",
                  backgroundColor: "#101726",
                  borderRadius: "0.75rem", // match .rounded-2xl if you like
                  border: "none",
                  boxShadow: "none",
                  overflow: "hidden",
                  margin: "0",
                  padding: "0",
                },

                // Dev banner also 100% wide so it matches the card
                devEnvironmentBanner: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                  textAlign: "center",
                  borderRadius: "0",
                },

                // 2) Hide the label above the email input
                // By default, Clerk uses "formFieldLabel__identifier"
                // or "formFieldLabel__emailAddress" depending on your config.
                // If you’re unsure, open DevTools & inspect the label's data-testid.
                formFieldLabel__emailAddress: {
                  display: "none",
                },

                // Make sure the placeholder says "Email address" so the user sees it
                formFieldInput__emailAddress: {
                  placeholder: "Email address",
                },

                // You can keep or remove any other overrides you need
                headerTitle: {
                  fontSize: "24px",
                  fontWeight: "700",
                  textAlign: "center",
                  color: "white",
                  marginTop: "16px",
                },
                headerSubtitle: {
                  textAlign: "center",
                  color: "rgba(156, 163, 175, 1)",
                },
                form: {
                  width: "100%",
                  maxWidth: "100%",
                  padding: "0 32px",
                  margin: "0 auto",
                },
                formFieldInput: {
                  backgroundColor: "#1a202c",
                  color: "white",
                  border: "1px solid rgba(75, 85, 99, 0.6)",
                  borderRadius: "6px",
                  padding: "14px 16px",
                  width: "100%",
                },
                formButtonPrimary: {
                  backgroundColor: "#1d4ed8",
                  color: "white",
                  fontWeight: "500",
                  borderRadius: "6px",
                  padding: "14px 16px",
                  width: "100%",
                  marginTop: "6px",
                  marginBottom: "16px",
                  display: "block",
                },
                footer: {
                  backgroundColor: "rgba(241, 245, 249, 1)",
                  borderTop: "1px solid rgba(229, 231, 235, 1)",
                  padding: "16px",
                  width: "100%",
                  boxSizing: "border-box",
                  margin: "0",
                },
                footerAction: {
                  justifyContent: "center",
                  color: "#f97316",
                  fontSize: "14px",
                  width: "100%",
                  textAlign: "center",
                },
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "iconButton",
                helpPageUrl: "",
                termsPageUrl: "",
              },
              variables: {
                colorPrimary: "#1d4ed8",
                colorText: "white",
                colorTextSecondary: "rgba(156, 163, 175, 1)",
                borderRadius: "6px",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>

      {/* Footer (optional) */}
      <div className="fixed bottom-6 left-0 right-0 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}
