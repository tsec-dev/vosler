"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
}

export default function AppNavBar({ isAdmin }: AppNavBarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Self Survey", href: "/self-assessment" },
    { name: "Course Survey", href: "/course-survey" },
    { name: "Instructor Panel", href: "/admin", adminOnly: true },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
      {/* Left Nav Links */}
      <div className="flex gap-4">
        {navLinks.map(
          (link) =>
            (!link.adminOnly || isAdmin) && (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-indigo-600 text-white"
                    : "text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
              </Link>
            )
        )}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-4">
        {isAdmin && (
          <>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition">
              Export to PDF
            </button>
            <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 text-sm font-medium transition">
              Reset Class
            </button>
          </>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
