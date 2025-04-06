// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-lg px-6 py-12">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Vosler
          </h1>
          <p className="mt-3 text-xl text-gray-400">Team Builder</p>
        </div>
        
        {/* Sign-in Card */}
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl font-bold text-gray-100">Sign In</h2>
            <p className="text-gray-400 mt-1">Access your mission control center</p>
          </div>
          
          {/* Sign In Component */}
          <div className="px-8 pb-8">
            <Link 
              href="/sign-in" 
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-medium transition-colors duration-200 shadow-lg shadow-blue-900/30"
            >
              Continue with Clerk
            </Link>
            
            <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
              New to Vosler? Contact your administrator for access.
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vosler Team Builder • All rights reserved
        </div>
      </div>
    </div>
  );
}