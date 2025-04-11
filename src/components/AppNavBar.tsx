
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
}

export default function AppNavBar({ isAdmin = false }: AppNavBarProps) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium">
          ← Return to Dashboard
        </Link>
        {!isAdmin && (
          <>
            <Link href="/self-assessment" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium">
              Self Survey
            </Link>
            <Link href="/course-survey" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium">
              Course Survey
            </Link>
          </>
        )}
        {isAdmin && (
          <Link href="/admin" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium">
            Instructor Panel
          </Link>
        )}
      </div>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
