// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Simple dark blue to black gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-black"></div>
      </div>
      
      <div className="relative z-10 w-[500px] max-w-[95vw]">
        <SignIn 
          appearance={{
            elements: {
              rootBox: {
                width: "100%"
              },
              card: {
                backgroundColor: "#101726",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(75, 85, 99, 0.4)",
                width: "100%"
              },
              headerTitle: {
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
                color: "white",
                marginTop: "10px"
              },
              headerSubtitle: {
                textAlign: "center",
                color: "rgba(156, 163, 175, 1)"
              },
              form: {
                gap: "24px",
                width: "100%",
                padding: "0 24px"
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
                "&:hover": {
                  backgroundColor: "#1e40af"
                }
              },
              footer: {
                backgroundColor: "rgba(241, 245, 249, 1)",
                borderTop: "1px solid rgba(229, 231, 235, 1)",
                padding: "16px"
              },
              footerAction: {
                justifyContent: "center",
                color: "#f97316",
                fontSize: "14px"
              },
              main: {
                padding: "32px 24px"
              },
              // MFA verification code input styling
              verificationCodeInput: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                width: "50px",
                height: "50px",
                fontSize: "20px",
                margin: "0 4px"
              },
              otpCodeInput: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                width: "50px",
                height: "50px",
                fontSize: "20px",
                margin: "0 4px"
              },
              identityPreview: {
                backgroundColor: "#1a202c",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                padding: "12px 16px"
              },
              identityPreviewText: {
                color: "white"
              },
              identityPreviewEditButton: {
                color: "#3b82f6"
              },
              formResendCodeLink: {
                color: "#3b82f6",
                marginTop: "8px"
              },
              // Alert box styling
              alert: {
                backgroundColor: "#1a202c",
                border: "1px solid rgba(75, 85, 99, 0.6)",
                borderRadius: "6px",
                padding: "16px",
                color: "white"
              },
              // Increase spacing between form elements
              formFieldRow: {
                marginBottom: "16px"
              },
              // Fix "Back" button styling
              formFieldAction: {
                color: "#3b82f6"
              }
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton"
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
      <div className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}