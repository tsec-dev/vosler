"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.emailAddresses?.[0]?.emailAddress || "User";

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
          Welcome, {displayName} 👋
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Uploads */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">📤 Upload Your Reports</h3>

            {/* Gallup Upload */}
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

            {/* EQ Upload */}
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

          {/* Right Column: Assigned + Breakout Team */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Assigned Team */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">👥 Assigned Team</h3>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-full">
                <p className="text-sm text-gray-600 mb-2">
                  This is your permanent instructor-assigned team.
                </p>
                <div className="text-center text-sm text-gray-400 py-4">
                  Team data will appear here once assigned.
                </div>
              </div>
            </div>

            {/* Breakout Team */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">⚡ Breakout Team</h3>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-full">
                <p className="text-sm text-gray-600 mb-2">
                  Temporarily generated based on strengths, EQ, and survey input.
                </p>
                <div className="text-center text-sm text-gray-400 py-4">
                  Breakout pairing will appear here once generated.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Admin + Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Team Generator */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">🧠 Generate Teams</h3>
            <p className="text-sm text-gray-600 mb-4">
              Automatically build balanced teams using EQ and Gallup data.
            </p>

            <label className="text-sm font-medium text-gray-700 block mb-1">
              Number of Teams
            </label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm"
              placeholder="e.g. 4"
            />

            <button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md text-sm transition"
              onClick={() => alert("Generating teams... (placeholder)")}
            >
              Generate Teams
            </button>
          </div>

          {/* Feedback Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">🔁 Weekly 360 Feedback</h3>
            <p className="text-sm text-gray-600 mb-4">
              Submit anonymous feedback on your teammates, the course, or instructors.
            </p>

            <label className="text-sm font-medium text-gray-700 block mb-1">
              Feedback Target
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm">
              <option>Teammate: Bob A.</option>
              <option>Instructor: TSgt Taylor</option>
              <option>Course Material</option>
            </select>

            <label className="text-sm font-medium text-gray-700 block mb-1">
              Rating (1–5)
            </label>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center space-x-1 text-sm text-gray-600">
                  <input type="radio" name="rating" value={num} />
                  <span>{num}</span>
                </label>
              ))}
            </div>

            <label className="text-sm font-medium text-gray-700 block mb-1">
              Comments (optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
              rows={3}
              placeholder="Write your feedback..."
            />

            <button
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md text-sm transition"
              onClick={() => alert("Feedback submitted!")}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
