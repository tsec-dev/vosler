"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
  showBackToDashboard?: boolean;
}

export default function AppNavBar({ isAdmin = false, showBackToDashboard = false }: AppNavBarProps) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        {showBackToDashboard ? (
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-white hover:underline">
            ← Return to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-white hover:underline">
              📊 Self Survey
            </Link>
            <Link href="/course-survey" className="text-sm font-medium text-gray-700 dark:text-white hover:underline">
              📋 Course Survey
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:underline">
                Instructor Panel
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 items-center">
        {showBackToDashboard && (
          <>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">
              Export to PDF
            </button>
            <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-medium">
              Reset Class
            </button>
          </>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
