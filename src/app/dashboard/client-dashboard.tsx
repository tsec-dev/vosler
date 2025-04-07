"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import { FiMenu } from "react-icons/fi";

interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
}

interface StudentProps {
  first_name: string;
  last_name: string;
}

interface Props {
  user: UserProps;
  student: StudentProps;
}

export default function ClientDashboard({ user, student }: Props) {
  const displayName =
    student.first_name && student.last_name
      ? `${student.first_name} ${student.last_name}`
      : user.email || "User";

  // Dark mode and menu state
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Upload state for Gallup PDF
  const [gallupUploadResult, setGallupUploadResult] = useState<any>(null);
  const [gallupUploading, setGallupUploading] = useState(false);
  const [gallupFileName, setGallupFileName] = useState("");

  // Toggle dark mode on document element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close hamburger menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Handler for Gallup PDF upload
  async function handleGallupUpload(file: File) {
    setGallupUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setGallupUploadResult(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setGallupUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 shadow relative">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Hamburger Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 focus:outline-none"
            >
              <FiMenu className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50"
              >
                <a
                  href="/admin"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Admin Panel
                </a>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </a>
              </div>
            )}
          </div>
          {/* Right Side: Dark Mode Toggle & User Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-800 text-white text-xs px-3 py-1 rounded focus:outline-none"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Welcome, {displayName} 👋</h2>

        {/* Grid for Uploads & Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Uploads */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold">📤 Upload Your Reports</h3>
            {/* Gallup Upload Card */}
            {gallupUploadResult ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium mb-2">Gallup Strengths:</p>
                {gallupUploadResult.data?.parsed_data?.top_strengths ? (
                  <ul className="list-disc list-inside">
                    {gallupUploadResult.data.parsed_data.top_strengths.map(
                      (str: string, idx: number) => (
                        <li key={idx}>{str}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No strengths detected.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium mb-2">Gallup Strengths PDF</p>
                <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded inline-block">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGallupFileName(file.name);
                        handleGallupUpload(file);
                      }
                    }}
                  />
                  {gallupUploading ? "Uploading..." : "Choose PDF File"}
                </label>
                <p className="mt-4 text-sm text-gray-400">
                  {gallupFileName
                    ? `📄 ${gallupFileName}`
                    : "No file uploaded yet"}
                </p>
              </div>
            )}

            {/* EQ Upload Card (for now, just the upload input) */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium mb-2">EQ-i 2.0 PDF</p>
              <input
                type="file"
                accept="application/pdf"
                className="block w-full text-sm text-gray-500 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                  file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Right Column: Teams */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Assigned Team Card */}
            <div>
              <h3 className="text-lg font-semibold mb-2">👥 Assigned Team</h3>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 h-full">
                <p className="text-sm mb-2">
                  This is your permanent instructor-assigned team.
                </p>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  Team data will appear here once assigned.
                </div>
              </div>
            </div>
            {/* Breakout Team Card */}
            <div>
              <h3 className="text-lg font-semibold mb-2">⚡ Breakout Team</h3>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 h-full">
                <p className="text-sm mb-2">
                  Temporarily generated based on strengths, EQ, and survey input.
                </p>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  Breakout pairing will appear here once generated.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Team Generator & 360 Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Team Generator Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">🧠 Generate Teams</h3>
            <p className="text-sm mb-4">
              Automatically build balanced teams using EQ and Gallup data.
            </p>
            <label className="text-sm font-medium block mb-1">
              Number of Teams
            </label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 mb-4 text-sm"
              placeholder="e.g. 4"
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md text-sm transition"
              onClick={() => alert("Generating teams... (placeholder)")}
            >
              Generate Teams
            </button>
          </div>

          {/* Weekly 360 Feedback Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">🔁 Weekly 360 Feedback</h3>
            <p className="text-sm mb-4">
              Submit anonymous feedback on teammates, instructors, or the course.
            </p>
            <label className="text-sm font-medium block mb-1">
              Feedback Target
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 mb-4 text-sm">
              <option>Teammate: Bob A.</option>
              <option>Instructor: TSgt Taylor</option>
              <option>Course Material</option>
            </select>
            {["Communication", "Social Awareness", "Boldness", "Leadership"].map((trait) => (
              <div key={trait} className="mb-4">
                <label className="block text-sm font-medium mb-1">{trait}</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num} className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name={`rating-${trait.toLowerCase().replace(" ", "-")}`}
                        value={num}
                        required
                      />
                      <span>{num}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <label className="text-sm font-medium block mb-1">
              Comments (optional)
            </label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm mb-4"
              rows={3}
              placeholder="Anything else you'd like to share?"
            ></textarea>
            <button
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md text-sm transition"
              onClick={() => alert("Feedback submitted anonymously!")}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
