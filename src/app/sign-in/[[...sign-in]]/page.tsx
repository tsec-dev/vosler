"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-black flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-xl w-[380px] p-6 flex flex-col items-center space-y-6">
        
        {/* Embedded Unit Logo */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 shadow">
          <img
            src="/unit-logo.png"
            alt="Unit Logo"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Sign-In Title */}
        <h1 className="text-white text-xl font-semibold -mt-2">Sign in to Vosler</h1>

        {/* Clerk Sign-In Component */}
        <div className="w-full">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none border-none",
                header: "hidden",
                headerTitle: "hidden",
                formFieldLabel: "text-gray-400",
                formFieldInput:
                  "bg-gray-800 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-500 text-white font-medium w-full",
                footer: "text-center text-sm text-gray-500",
                footerActionLink: "text-indigo-400 hover:underline",
              },
              variables: {
                colorPrimary: "#6366f1", // Tailwind indigo-500
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
