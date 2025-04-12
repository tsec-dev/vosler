"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Simple component for stars and goats with animation
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
      
      {/* Animated goat images */}
      <div className="absolute top-[15%] left-[10%] opacity-30 floating" style={{ animationDelay: "0s" }}>
        <img
          src="/image.png"
          alt="Goat Constellation 1"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="absolute top-[60%] left-[70%] opacity-30 floating-sideways" style={{ animationDelay: "3s" }}>
        <img
          src="/image.png"
          alt="Goat Constellation 2" 
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
      <div className="absolute top-[30%] left-[85%] opacity-30 floating" style={{ animationDelay: "5s" }}>
        <img
          src="/image.png"
          alt="Goat Constellation 3" 
          width={90}
          height={90}
          className="object-contain"
        />
      </div>
      <div className="absolute top-[75%] left-[25%] opacity-30 floating-sideways" style={{ animationDelay: "2s" }}>
        <img
          src="/image.png"
          alt="Goat Constellation 4" 
          width={110}
          height={110}
          className="object-contain"
        />
      </div>
      <div className="absolute top-[40%] left-[45%] opacity-30 floating-combo" style={{ animationDelay: "4s" }}>
        <img
          src="/image.png"
          alt="Goat Constellation 5" 
          width={130}
          height={130}
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
      .pulsing {
        animation: pulse 8s ease-in-out infinite;
      }
      .floating-combo {
        animation: 
          float 20s ease-in-out infinite,
          floatSideways 23s ease-in-out infinite;
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black text-white overflow-hidden">
      {/* Starry background with floating goats */}
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