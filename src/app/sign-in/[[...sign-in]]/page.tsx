"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <div className="min-h-screen flex items-center justify-center relative">
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
