"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import IntegratedBackground from "@/components/IntegratedBackground";

export default function Home() {
  // Add animation styles directly (backup in case they're not loaded in the IntegratedBackground)
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    
    // Define animations if they don't already exist
    if (!document.querySelector('style[data-animation="goats"]')) {
      style.setAttribute('data-animation', 'goats');
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatSideways {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .floating {
          animation: float 20s ease-in-out infinite;
        }
        .floating-sideways {
          animation: floatSideways 18s ease-in-out infinite;
        }
        .floating-combo {
          animation: 
            float 20s ease-in-out infinite,
            floatSideways 23s ease-in-out infinite;
        }
      `;
      
      // Add style to head
      document.head.appendChild(style);
    }
    
    // Clean up on unmount
    return () => {
      // Only remove if it's the style we added
      if (document.querySelector('style[data-animation="goats"]') === style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black text-white overflow-hidden">
      {/* Integrated Background with both particles and goats */}
      <IntegratedBackground />

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
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-100">Welcome!</h2>
          </div>
          <div className="px-8 pb-8">
            <Link
              href="/sign-in"
              className="block w-full py-3 px-4 bg-blue-700 hover:bg-blue-600 rounded-lg text-center font-medium transition-colors duration-200 shadow-lg shadow-blue-900/30"
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