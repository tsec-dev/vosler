// src/app/providers.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Remove the toggle button here so it doesn't conflict.
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
