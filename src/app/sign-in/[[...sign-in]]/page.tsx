"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <ClerkProvider>
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-[#101726]" />
        {/* Centered SignIn widget */}
        <div className="relative z-10">
          <SignIn redirectUrl="/dashboard" />
        </div>
      </div>
    </ClerkProvider>
  );
}
