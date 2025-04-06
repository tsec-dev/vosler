"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Simple dark blue to black gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-black" />

      {/* Established container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[460px] max-w-[95vw] z-10">
        <div className="overflow-hidden rounded-2xl border border-gray-800">
          <SignIn
            appearance={{
              elements: {
                // Ensure the Clerk container fits the parent container
                rootBox: {
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto",
                },
                card: {
                  width: "100%",
                  margin: "0",
                  backgroundColor: "#101726",
                  borderRadius: "0",
                  boxShadow: "none",
                  border: "none",
                  overflow: "hidden",
                },
                // You can leave the rest of your appearance overrides as is
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
                  gap: "24px",
                  width: "100%",
                  padding: "0 32px",
                  maxWidth: "396px",
                  margin: "0 auto",
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
                  maxWidth: "396px",
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
                  maxWidth: "396px",
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
                // Optionally, if you have a dev environment banner:
                devEnvironmentBanner: {
                  margin: "0 auto",
                  width: "100%",
                  maxWidth: "460px",
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

      {/* Footer */}
      <div className="fixed bottom-6 left-0 right-0 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}
