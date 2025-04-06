// src/app/sign-in/page.tsx
"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
