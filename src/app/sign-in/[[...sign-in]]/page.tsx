// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black text-white overflow-hidden">
      {/* Simple dark blue to black gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-black"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      <div className="w-full relative z-10 flex flex-col items-center justify-center">
        {/* Clerk SignIn component - use a fixed width for better alignment */}
        <div className="w-[460px] max-w-[90vw] bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 overflow-hidden">
          <SignIn 
            appearance={{
              elements: {
                card: {
                  boxShadow: 'none',
                  width: '100%',
                  margin: '0 auto',
                  background: 'transparent'
                },
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-400',
                formFieldInput: 'bg-gray-800 border-gray-700 text-white',
                formFieldLabel: 'text-gray-300',
                footerActionLink: 'text-blue-400 hover:text-blue-300',
                identityPreviewText: 'text-gray-300',
                formFieldAction: 'text-blue-400 hover:text-blue-300',
                rootBox: 'mx-auto',
                form: {
                  margin: '0 auto',
                  width: '100%',
                  maxWidth: '100%'
                },
                formFieldRow: {
                  margin: '0 auto',
                  width: '100%',
                  maxWidth: '100%'
                },
                formButtonPrimary: {
                  backgroundColor: '#0033a0',
                  '&:hover': {
                    backgroundColor: '#002787'
                  },
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
              },
              layout: {
                socialButtonsPlacement: 'bottom',
                socialButtonsVariant: 'iconButton'
              },
              variables: {
                spacingUnit: '0.75rem',
                borderRadius: '0.375rem'
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
        </div>
      </div>
    </div>
  );
}