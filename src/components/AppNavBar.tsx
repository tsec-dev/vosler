"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
}

export default function AppNavBar({ isAdmin = false }: AppNavBarProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  const baseBtn = "px-4 py-2 rounded text-sm font-medium transition text-white";
  const linkClass = `${baseBtn} bg-indigo-600 hover:bg-indigo-500`;
  const dangerBtn = `${baseBtn} bg-red-600 hover:bg-red-500`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex gap-4 items-center">
        {/* Always show return to dashboard */}
        <Link href="/dashboard" className={linkClass}>
          ← Return to Dashboard
        </Link>

        {/* Show these only if NOT on admin pages */}
        {!isAdminPage && (
          <>
            <Link href="/self-assessment" className={linkClass}>
              📝 Self Survey
            </Link>
            <Link href="/course-survey" className={linkClass}>
              📋 Course Survey
            </Link>
            {isAdmin && (
              <Link href="/admin" className={linkClass}>
                🧑‍🏫 Instructor
              </Link>
            )}
          </>
        )}

        {/* Show admin tools only on admin pages */}
        {isAdminPage && (
          <>
            <button className={linkClass}>Export to PDF</button>
            <button className={dangerBtn}>Reset Class</button>
          </>
        )}
      </div>

      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
