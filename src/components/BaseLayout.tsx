"use client";

import { ReactNode } from "react";
import AppNavBar from "@/components/AppNavBar";


interface BaseLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
  showBackToDashboard?: boolean;
}

export default function BaseLayout({ children, isAdmin = false, showBackToDashboard = false }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <AppNavBar isAdmin={isAdmin} showBackToDashboard={showBackToDashboard} />
      <main className="p-6">{children}</main>
    </div>
  );
}
