import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface AppNavBarProps {
  isAdmin?: boolean;
  showBackToDashboard?: boolean;
}

export default function AppNavBar({ isAdmin = false, showBackToDashboard = false }: AppNavBarProps) {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-4 items-center">
        {showBackToDashboard && (
          <Link
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            ← Return to Dashboard
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Instructor Panel
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
