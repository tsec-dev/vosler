"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function AppNavBar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Self-Assessment", href: "/self-assessment" },
    { name: "Course Survey", href: "/course-survey" },
  ];

  if (isAdmin) {
    navItems.push({ name: "Instructor Panel", href: "/admin" });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-500"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}
