"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-black flex items-center justify-center">
      <div className="bg-[#111827] border border-gray-800 shadow-2xl rounded-2xl w-full max-w-md px-8 py-10 flex flex-col items-center space-y-6">

        {/* Logo */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <img
            src="/unit-logo.png"
            alt="Unit Logo"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-white text-xl font-semibold -mt-1">
          Sign in to Vosler
        </h1>

        {/* Clerk Form */}
        <div className="w-full">
          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
              },
              elements: {
                card: "shadow-none border-none bg-transparent p-0",
                header: "hidden",
                footer: "hidden",
                formFieldLabel: "text-sm text-gray-300",
                formFieldInput:
                  "bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-2 rounded-md",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-500 text-white font-medium w-full mt-4 rounded-md",
              },
              variables: {
                colorPrimary: "#6366f1",
              },
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
