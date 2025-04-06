"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black animate-background flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black opacity-50 animate-pulse z-0" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* UNIT LOGO */}
        <img
          src="/unit-logo.png"
          alt="Unit Emblem"
          className="h-36 w-36 rounded-full border-4 border-gray-700 shadow-lg object-cover"
        />

        {/* CLERK SIGN-IN */}
        <SignIn
          appearance={{
            elements: {
              card: "bg-gray-900 border border-gray-700 text-white shadow-2xl w-[350px]",
              headerTitle: "text-white text-xl font-semibold",
              formFieldLabel: "text-gray-400",
              formFieldInput: "bg-gray-800 border border-gray-600 text-white",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-medium",
              footerActionText: "text-gray-500",
              footerActionLink: "text-indigo-400 hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
