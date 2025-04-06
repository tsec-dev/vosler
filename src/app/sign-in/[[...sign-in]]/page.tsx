"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#141528] to-[#1a1d3a]">
      <div className="bg-[#0f111b] rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
        <Image
          src="/unit-logo.png" // Make sure you have this in your /public folder
          alt="Unit Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-xl font-semibold text-white mb-1">Sign in to Vosler</h1>
        <p className="text-sm text-gray-400 mb-6">Team Builder Portal</p>

        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border-none bg-transparent p-0 m-0 ring-0 outline-none",
              headerTitle: "hidden", // hide Clerk's default title
              headerSubtitle: "hidden", // hide subtitle
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 transition text-white",
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
