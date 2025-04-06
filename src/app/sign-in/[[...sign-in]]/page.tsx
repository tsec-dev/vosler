"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Background gradient, now ending in the same color as the card */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-[#101726]" />

      {/* Established container */}
      <div className="w-[460px] max-w-[95vw] z-10">
        <div className="overflow-hidden rounded-2xl border border-[#101726]">
          <SignIn
            appearance={{
              elements: {
                // Force the root container to fill the parent container.
                rootBox: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                },
                // Force the card to fill the parent container with no extra spacing.
                card: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0",
                  padding: "0",
                  backgroundColor: "#101726",
                  borderRadius: "0",
                  boxShadow: "none",
                  border: "none",
                  overflow: "hidden",
                },
                // Developer banner fills the same width as the card.
                devEnvironmentBanner: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                  textAlign: "center",
                  borderRadius: "0",
                },
                // Form container inside the card.
                form: {
                  width: "100%",
                  maxWidth: "100%",
                  padding: "0 32px",
                  margin: "0 auto",
                },
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
                formFieldLabel: {
                  color: "rgba(156, 163, 175, 1)",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
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
                main: {
                  padding: "32px 0",
                  width: "100%",
                },
                verificationCodeDigitsRow: {
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  margin: "24px auto",
                },
                verificationCodeInput: {
                  backgroundColor: "white",
                  color: "#1a202c",
                  border: "1px solid rgba(160, 174, 192, 0.6)",
                  borderRadius: "6px",
                  width: "46px",
                  height: "46px",
                  fontSize: "18px",
                  textAlign: "center",
                  padding: "0",
                },
                otpCodeContainer: {
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  margin: "24px auto",
                },
                otpCodeInput: {
                  backgroundColor: "white",
                  color: "#1a202c",
                  border: "1px solid rgba(160, 174, 192, 0.6)",
                  borderRadius: "6px",
                  width: "46px",
                  height: "46px",
                  fontSize: "18px",
                  textAlign: "center",
                },
                identityPreview: {
                  backgroundColor: "#1a202c",
                  color: "white",
                  border: "1px solid rgba(75, 85, 99, 0.6)",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                },
                identityPreviewText: {
                  color: "white",
                },
                identityPreviewEditButton: {
                  color: "#3b82f6",
                },
                formResendCodeLink: {
                  color: "#3b82f6",
                  textAlign: "center",
                  display: "block",
                  marginTop: "8px",
                },
                alert: {
                  backgroundColor: "#1a202c",
                  border: "1px solid rgba(75, 85, 99, 0.6)",
                  borderRadius: "6px",
                  padding: "16px",
                  color: "white",
                  margin: "16px 0",
                },
                formFieldRow: {
                  marginBottom: "16px",
                  width: "100%",
                },
                formFieldAction: {
                  color: "#3b82f6",
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

      {/* Footer */}
      <div className="fixed bottom-6 left-0 right-0 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}
