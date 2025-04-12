// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import ConstellationCanvas from "@/components/ConstellationCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Star Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ConstellationCanvas />
      </div>

      {/* 🐐 Faded Constellation Goat */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <Image
          src="/image.png" // Make sure this file is inside /public
          alt="Goat Constellation"
          width={800}
          height={800}
          className="object-contain"
          priority
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-lg px-6 py-12 relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Image
              src="/unit-logo.png"
              alt="Vosler Logo"
              width={200}
              height={80}
              className="h-auto"
              priority
            />
          </div>
        </div>

        {/* Sign-in Card */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-100">Welcome!</h2>
          </div>

          <div className="px-8 pb-8">
            <Link
              href="/sign-in"
              className="block w-full py-3 px-4 bg-[#0033a0] hover:bg-[#002787] rounded-lg text-center font-medium transition-colors duration-200 shadow-lg shadow-blue-900/30"
            >
              Access the mission control center.
            </Link>

            <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
              New here? Contact your leads for access.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vosler | Team Development Demo • All rights reserved
        </div>
      </div>
    </div>
  );
}
