// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {/* Simple dark blue to black gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-black"></div>
      </div>
      
      {/* Force container to be truly centered by using fixed positioning and transform */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[460px] max-w-[95vw] z-10">
        <SignIn 
          appearance={{
            elements: {
              rootBox: {
                width: "100%",
                maxWidth: "100%",
                margin: "0 auto"
              },
              card: {
                backgroundColor: "#101726",
                borderRadius: "16px", 
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(75, 85, 99, 0.4)",
                width: "100%",
                overflow: "hidden" // Important to contain the footer
              },
              headerTitle: {
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
                color: "white",
                marginTop: "16px"
              },
              headerSubtitle: {
                textAlign: "center",
                color: "rgba(156, 163, 175, 1)"
              },
              form: {
                gap: "24px",
                width: "100%",
                padding: "0 32px"
              },
              formFieldLabel: {
                color: "rgba(156, 163, 175, 1)",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px"
              },
              formFieldInput: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                padding: "14px 16px",
                width: "100%"
              },
              formButtonPrimary: {
                backgroundColor: "#1d4ed8",
                color: "white",
                fontWeight: "500",
                borderRadius: "6px",
                padding: "14px 16px",
                width: "100%",
                marginTop: "6px",
                marginBottom: "16px", // Added to prevent overflow
                "&:hover": {
                  backgroundColor: "#1e40af"
                }
              },
              footer: {
                backgroundColor: "rgba(241, 245, 249, 1)",
                borderTop: "1px solid rgba(229, 231, 235, 1)",
                padding: "16px",
                width: "100%", // Make sure footer takes full width
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                boxSizing: "border-box",
                // Fix for footer overflow
                marginLeft: "0",
                marginRight: "0"
              },
              footerAction: {
                justifyContent: "center",
                color: "#f97316",
                fontSize: "14px",
                width: "100%",
                textAlign: "center"
              },
              main: {
                padding: "32px 0", // Horizontal padding moved to form
                width: "100%"
              },
              // MFA verification code input styling
              verificationCodeDigitsRow: {
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                margin: "24px 0"
              },
              verificationCodeInput: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                width: "46px",
                height: "46px",
                fontSize: "18px",
                margin: "0 4px",
                textAlign: "center"
              },
              otpCodeContainer: {
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                margin: "24px 0"
              },
              otpCodeInput: {
                backgroundColor: "#1a202c !important",
                color: "white !important",
                border: "1px solid rgba(75, 85, 99, 0.6) !important",
                borderRadius: "6px !important",
                width: "46px !important",
                height: "46px !important",
                fontSize: "18px !important",
                margin: "0 4px !important",
                textAlign: "center !important"
              },
              identityPreview: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "16px"
              },
              identityPreviewText: {
                color: "white"
              },
              identityPreviewEditButton: {
                color: "#3b82f6"
              },
              formResendCodeLink: {
                color: "#3b82f6",
                textAlign: "center",
                display: "block",
                marginTop: "8px"
              },
              // Alert box styling
              alert: {
                backgroundColor: "#1a202c",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                padding: "16px",
                color: "white",
                margin: "16px 0"
              },
              // Increase spacing between form elements
              formFieldRow: {
                marginBottom: "16px",
                width: "100%"
              },
              // Fix "Back" button styling
              formFieldAction: {
                color: "#3b82f6"
              }
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
              helpPageUrl: "", // No help page
              termsPageUrl: "" // No terms page
            },
            variables: {
              colorPrimary: "#1d4ed8",
              colorText: "white",
              colorTextSecondary: "rgba(156, 163, 175, 1)",
              borderRadius: "6px",
              fontFamily: "system-ui, sans-serif",
              // Increase spacing
              spacingUnit: "8px"
            }
          }}
          redirectUrl="/dashboard"
        />
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-6 left-0 right-0 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}