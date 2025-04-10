"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

// === Props & Types ===
interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

interface StudentProps {
  first_name: string;
  last_name: string;
}

interface DashboardProps {
  user: UserProps;
  student: StudentProps;
  week?: number;
}

const traits = ["Communication", "Leadership", "EQ", "Adaptability", "Integrity", "Boldness"];
const weekThemes = ["Architect", "Foundation", "Reflection", "Execution"];

export default function StudentDashboard({ user, student, week = 2 }: DashboardProps) {
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});
  const [journalEntry, setJournalEntry] = useState("");

  const displayName =
    student?.first_name && student?.last_name
      ? `${student.first_name} ${student.last_name}`
      : user.firstName;

  const weekTheme = weekThemes[week - 1] || "Growth";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {displayName}, to Week {week}: {weekTheme}
        </h1>
        <div className="flex gap-4 items-center">
          {user?.isAdmin && (
            <a href="/admin" className="text-sm text-blue-500 underline">
              Instructor Panel
            </a>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Growth Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">📈 Self-Assessment</h2>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">👥 Peer Feedback</h2>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      {/* Feedback To-Do */}
      <div className="bg-white dark:bg-gray-900 rounded shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">📝 Feedback To-Do</h2>
        <ul className="list-disc list-inside text-sm space-y-2">
          <li>Teammate: Jamie Chen <a href="#" className="text-blue-500 ml-2 underline">Give Feedback</a></li>
          <li>Instructor: TSgt Taylor <a href="#" className="text-blue-500 ml-2 underline">Give Feedback</a></li>
        </ul>
      </div>

      {/* Self-Assessment Form */}
      <div className="bg-white dark:bg-gray-900 rounded shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">🔁 Weekly Self-Assessment</h2>
        {traits.map((trait) => (
          <div key={trait} className="mb-4">
            <label className="block text-sm font-medium mb-1">{trait}</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center space-x-1 text-sm">
                  <input
                    type="radio"
                    name={`self-${trait}`}
                    value={num}
                    onChange={() =>
                      setSelfAssessment((prev) => ({ ...prev, [trait]: num }))
                    }
                  />
                  <span>{num}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <label className="block text-sm font-medium mb-1 mt-4">🪞 Reflection Prompt</label>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm mb-4"
          rows={3}
          placeholder="What’s one leadership moment you had this week?"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        ></textarea>
        <button className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md text-sm transition">
          Submit Self-Assessment
        </button>
      </div>

      {/* Quote of the Week */}
      <div className="text-center text-sm italic text-gray-600 dark:text-gray-400">
        “Leadership is not about being in charge. It is about taking care of those in your charge.” – Simon Sinek
      </div>
    </div>
  );
}
