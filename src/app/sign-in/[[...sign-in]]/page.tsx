"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SignIn redirectUrl="/dashboard" />
      </div>
    </ClerkProvider>
  );
}
