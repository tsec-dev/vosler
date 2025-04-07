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
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h2>
          <p>Your dashboard content goes here.</p>

          {/* Upload Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Upload Your Reports</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {/* Strengths PDF */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700 mb-2">Gallup Strengths PDF</p>
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

              {/* EQ PDF */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700 mb-2">EQ-i 2.0 PDF</p>
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
          </div>

          {/* My Team Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-2">My Team</h3>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 text-center">
              Team data will appear here once assigned.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
