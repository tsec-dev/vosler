"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Background gradient matching the sign-in card */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-[#101726]" />

      {/* Centered container (fixed width of 460px) */}
      <div className="relative z-10 w-[460px] max-w-[95vw]">
        <div className="overflow-hidden rounded-2xl">
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: "100%",
                  margin: "0 auto",
                },
                card: {
                  width: "100%",
                  backgroundColor: "#101726",
                  border: "none",
                  boxShadow: "none",
                },
                devEnvironmentBanner: {
                  display: "none",
                },
                headerTitle: {
                  fontSize: "24px",
                  fontWeight: "700",
                  textAlign: "center",
                  color: "white",
                  marginTop: "16px",
                },
                headerSubtitle: {
                  display: "none",
                },
                form: {
                  width: "100%",
                  padding: "0 32px",
                  margin: "0 auto",
                },
                formFieldLabel: {
                  display: "none",
                },
                formFieldInput: {
                  backgroundColor: "#1a202c",
                  color: "white",
                  border: "1px solid #2c3a4d",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  width: "100%",
                },
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
                footer: {
                  display: "none",
                },
              },
              layout: {
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
