"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Source_Code_Pro } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Vosler | Team Builder",
  description: "Mission-Ready Team Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceCodePro.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors`}
      >
        <ClerkProvider>
          {/* Dark mode toggle */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-800 text-white text-xs px-3 py-1 rounded hover:bg-gray-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
