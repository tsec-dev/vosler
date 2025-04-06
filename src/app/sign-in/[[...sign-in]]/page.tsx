// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black text-white overflow-hidden">
      {/* USSF themed space background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0033a0] via-[#1a2654] to-black animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        
        {/* Optional: subtle star effect */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
      </div>
      
      <div className="w-full max-w-md p-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/unit-logo.png" 
              alt="Vosler Logo" 
              width={180} 
              height={70} 
              className="h-auto" 
              priority
            />
          </Link>
        </div>
        
        {/* Clerk SignIn component in a nice card */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 overflow-hidden p-2">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-[#0033a0] hover:bg-[#002787] text-white shadow-md',
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
          © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
        </div>
      </div>
    </div>
  );
}