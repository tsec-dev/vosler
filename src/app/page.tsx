"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// For now, let's just use a simple background component
// instead of trying to import the IntegratedBackground

// Simple component for stars and goats
function StarryBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Static stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}
      
      {/* Static goat images */}
      <div className="absolute top-[15%] left-[10%] opacity-30">
        <img
          src="/image.png"
          alt="Goat Constellation 1"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="absolute top-[60%] left-[70%] opacity-30">
        <img
          src="/image.png"
          alt="Goat Constellation 2" 
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function Home() {
  // Add animation styles directly
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    
    // Define animations
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .animate-float-slow {
        animation: float 20s ease-in-out infinite;
      }
      .animate-pulse {
        animation: pulse 3s ease-in-out infinite;
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Check if the image exists
  useEffect(() => {
    // Create an image element properly with type checking
    const imgElement = document.createElement('img');
    
    // Set up error handler
    imgElement.onerror = () => {
      console.error("Failed to load image.png");
    };
    
    // Set source to test loading
    imgElement.src = "/image.png";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black text-white overflow-hidden">
      {/* Simple starry background */}
      <StarryBackground />

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