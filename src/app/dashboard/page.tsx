"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress} 👋
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section Title */}
            <h3 className="text-lg font-semibold text-gray-700">📤 Upload Your Reports</h3>

            {/* Gallup Upload Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-800 mb-2">Gallup Strengths PDF</p>
              <input
                type="file"
                accept="application/pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            {/* EQ Upload Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-800 mb-2">EQ-i 2.0 PDF</p>
              <input
                type="file"
                accept="application/pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Right Column: Team Card */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">👥 My Team</h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-full">
              <p className="text-sm text-gray-600 mb-2">
                View your assigned teammates here. Instructors can assign permanent or breakout teams.
              </p>
              <div className="text-center text-sm text-gray-400 py-4">
                Team data will appear here once assigned.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
