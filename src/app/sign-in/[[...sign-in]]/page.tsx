"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#141528] to-[#1a1d3a]">
      <div className="bg-[#0f111b] rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4 rounded-full bg-[#18192b] p-4 border border-[#2a2c45]">
            <Image
              src="/unit-logo.png"
              alt="Vosler Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Sign in to Vosler</h1>
          <p className="text-sm text-gray-400 mb-2">Team Builder Portal</p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border-none bg-transparent p-0 m-0 ring-0 outline-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary: "bg-[#535eff] hover:bg-[#4349cc] text-white py-3 rounded-md font-medium transition-all",
              formFieldInput: "bg-[#161827] border border-[#2a2c45] rounded-md text-white px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#535eff]",
              footerActionLink: "text-[#535eff] hover:text-[#6b74ff]",
              formFieldLabel: "text-gray-300 text-sm",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-[#535eff]",
              alertText: "text-gray-300",
              socialButtonsIconButton: "border border-[#2a2c45] bg-[#161827] hover:bg-[#1e2032]",
              socialButtonsProviderIcon: "text-white",
              dividerLine: "bg-[#2a2c45]",
              dividerText: "text-gray-400",
              formFieldAction: "text-[#535eff]",
              formFieldSuccessText: "text-green-500",
              otpCodeFieldInput: "bg-[#161827] border border-[#2a2c45] text-white focus:border-[#535eff]",
            },
            layout: {
              socialButtonsVariant: "iconButton",
            },
            variables: {
              colorPrimary: "#535eff",
              colorText: "white",
              colorBackground: "transparent",
              colorInputBackground: "#161827",
              colorInputText: "white",
            }
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}