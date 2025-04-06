// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-6">
        {/* Header with brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Vosler
          </h1>
          <p className="mt-2 text-gray-400">Team Builder</p>
        </div>
        
        {/* Clerk SignIn component in a nice card */}
        <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden p-2">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-400',
                formFieldInput: 
                  'bg-gray-800 border-gray-700 text-white',
                formFieldLabel: 'text-gray-300',
                footerActionLink: 'text-blue-400 hover:text-blue-300',
                identityPreviewText: 'text-gray-300',
                formFieldAction: 'text-blue-400 hover:text-blue-300',
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Vosler Team Builder • All rights reserved
        </div>
      </div>
    </div>
  );
}