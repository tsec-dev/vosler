"use client";

import { ReactNode } from "react";
import AppNavBar from "@/components/AppNavBar";

interface BaseLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function BaseLayout({ children, isAdmin = false }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <AppNavBar isAdmin={isAdmin} />
      <main className="p-6">{children}</main>
    </div>
  );
}
