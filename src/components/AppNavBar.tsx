"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
  showBackToDashboard?: boolean;
}

export default function AppNavBar({ isAdmin = false, showBackToDashboard = false }: AppNavBarProps) {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <a className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium">
            ← Return to Dashboard
          </a>
        </Link>

        {!isAdmin && (
          <>
            <Link href="/self-assessment">
              <a className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium">Self Survey</a>
            </Link>
            <Link href="/course-survey">
              <a className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium">Course Survey</a>
            </Link>
            <Link href="/admin">
              <a className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium">Instructor</a>
            </Link>
          </>
        )}
      </div>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
