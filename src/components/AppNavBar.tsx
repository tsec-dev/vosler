interface AppNavBarProps {
  isAdmin?: boolean;
  showBackToDashboard?: boolean;
}

export default function AppNavBar({ isAdmin = false, showBackToDashboard = false }: AppNavBarProps) {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        {showBackToDashboard && (
          <a
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            ← Return to Dashboard
          </a>
        )}
        {!isAdmin && !showBackToDashboard && (
          <>
            <a
              href="/self-assessment"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Self Survey
            </a>
            <a
              href="/course-survey"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Course Survey
            </a>
          </>
        )}
        {isAdmin && !showBackToDashboard && (
          <a
            href="/admin"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Instructor Panel
          </a>
        )}
      </div>
    </nav>
  );
}
