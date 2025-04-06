// src/app/sign-in/page.tsx (or wherever your sign-in page is located)
"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#141528] to-[#1a1d3a]">
      <div className="bg-[#0f111b] rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#1e2133] rounded-full p-3 mb-6">
            <Image
              src="/unit-logo.png"
              alt="Vosler Logo"
              width={70}
              height={70}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Sign in to Vosler</h1>
          <p className="text-sm text-gray-400">Team Builder Portal</p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border-none bg-transparent p-0 m-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary: "bg-[#5b68ff] hover:bg-[#4a56e8] text-white py-3 rounded-md font-medium transition-all",
              formFieldInput: "bg-[#171923] border border-[#2a2c45] rounded-md text-white px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#5b68ff]",
              footerActionLink: "text-[#5b68ff] hover:text-[#6b74ff]",
              formFieldLabel: "text-gray-300 text-sm",
              formFieldLabelRow: "mb-1",
              formFieldRow: "mb-4",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-[#5b68ff]",
              alertText: "text-gray-300",
              socialButtonsIconButton: "border border-[#2a2c45] bg-[#171923] hover:bg-[#1e2032]",
              socialButtonsProviderIcon: "text-white",
              dividerLine: "bg-[#2a2c45]",
              dividerText: "text-gray-400",
              formFieldAction: "text-[#5b68ff]",
              footer: "hidden",
              main: "gap-0",
            },
            layout: {
              socialButtonsVariant: "iconButton",
            },
            variables: {
              colorPrimary: "#5b68ff",
              colorText: "white",
              colorBackground: "transparent",
              colorInputBackground: "#171923",
              colorInputText: "white",
              borderRadius: "0.375rem",
            }
          }}
          path="/sign-in"
          routing="path"
          redirectUrl="/dashboard" // Redirect to dashboard after successful sign-in
          afterSignInUrl="/dashboard" // Alternative way to specify redirect
        />
      </div>
    </div>
  );
}
