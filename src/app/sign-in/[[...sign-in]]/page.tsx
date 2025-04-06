// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Simple dark blue to black gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1933] to-black"></div>
      </div>

      {/* Custom sign-in form that exactly matches your screenshot */}
      <div className="w-[460px] max-w-[95vw] bg-[#101726] rounded-2xl shadow-xl border border-gray-800 overflow-hidden relative z-10">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Sign in to Vosler Team Portal</h1>
            <p className="text-gray-400">Welcome back! Please sign in to continue</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="block w-full rounded-md bg-[#1a202c] border border-gray-700 py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 bg-[#1d4ed8] hover:bg-blue-700 rounded-md text-white font-medium transition-colors duration-200"
            >
              Continue <span className="ml-2">▶</span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 text-orange-500 p-4 text-center border-t border-gray-200">
          Development mode
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
      </div>
    </div>
  );
}