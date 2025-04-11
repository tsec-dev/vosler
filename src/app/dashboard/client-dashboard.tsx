"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

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

function capitalizeFirstName(name?: string) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

interface DashboardProps {
  user: UserProps;
  student: StudentProps;
  week?: number;
}

const traits = ["Communication", "Leadership", "EQ", "Adaptability", "Integrity", "Boldness"];
const weekThemes = ["Architect", "Foundation", "Reflection", "Execution"];

const fakeBarData = [
  { trait: "Communication", self: 4, peer: 3 },
  { trait: "Leadership", self: 5, peer: 4 },
  { trait: "EQ", self: 3, peer: 4 },
  { trait: "Adaptability", self: 4, peer: 3 },
  { trait: "Integrity", self: 5, peer: 5 },
  { trait: "Boldness", self: 2, peer: 3 },
];

export default function StudentDashboard({ user, student, week = 2 }: DashboardProps) {
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});
  const [journalEntry, setJournalEntry] = useState("");

  const displayName = student?.first_name && student?.last_name
    ? `${student.first_name} ${student.last_name}`
    : user.firstName;

  const weekTheme = weekThemes[week - 1] || "Growth";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
        <h1 className="text-2xl font-bold mb-6">
          👋 Welcome, {capitalizeFirstName(student.first_name || user.firstName)}, to Week {week}: {weekTheme}
        </h1>
        </div>
      </div>

      {/* Quote */}
      <div className="text-center text-sm italic text-gray-600 dark:text-gray-400 mb-8">
        “Leadership is not about being in charge. It is about taking care of those in your charge.” – Simon Sinek
      </div>

      {/* Growth Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Self-Assessment Bar Chart */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow relative">
          <h2 className="text-lg font-semibold mb-4">📈 Self-Assessment</h2>
          <div className="space-y-4">
            {fakeBarData.map(({ trait, self }) => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{trait}</span>
                  <span className="text-sm text-gray-500">{self}/5</span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-800 h-5 rounded relative group">
                  <motion.div
                    className="bg-green-500 h-5 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${(self / 5) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition">
                    View feedback in {trait}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Feedback Bar Chart */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow relative">
          <h2 className="text-lg font-semibold mb-4">👥 Peer Feedback</h2>
          <div className="space-y-4">
            {fakeBarData.map(({ trait, peer }) => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{trait}</span>
                  <span className="text-sm text-gray-500">{peer}/5</span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-800 h-5 rounded relative group">
                  <motion.div
                    className="bg-blue-500 h-5 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${(peer / 5) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition">
                    View feedback in {trait}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback To-Do */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">📝 Feedback To-Do</h2>
        <div className="space-y-4">
          {["Jamie Chen", "TSgt Taylor"].map((name, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center"
            >
              <span className="text-sm font-medium">{name}</span>
              <a
                href="#"
                className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm font-medium"
              >
                Go to Feedback
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Self-Assessment */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">🔁 Weekly Self-Assessment</h2>
        {traits.map((trait) => (
          <div key={trait} className="mb-4">
            <label className="block text-sm font-medium mb-1">{trait}</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  className={`cursor-pointer ${
                    (selfAssessment[trait] || 0) >= num
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onClick={() =>
                    setSelfAssessment((prev) => ({ ...prev, [trait]: num }))
                  }
                />
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
    </div>
  );
}
