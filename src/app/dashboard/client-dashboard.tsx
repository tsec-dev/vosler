"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

function capitalizeFirstName(name?: string) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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

export default function ClientDashboard({ user, student, week = 2 }: DashboardProps) {
  const displayName = capitalizeFirstName(student.first_name || user.firstName);
  const weekTheme = weekThemes[week - 1] || "Growth";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      {/* Welcome Title */}
      <h1 className="text-2xl font-bold mb-6">
        👋 Welcome, {displayName}, to Week {week}: {weekTheme}
      </h1>

      {/* Quote */}
      <div className="text-center text-sm italic text-gray-600 dark:text-gray-400 mb-8">
        “Leadership is not about being in charge. It is about taking care of those in your charge.” – Simon Sinek
      </div>

      {/* Course Announcements */}
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100 rounded-lg shadow p-4 mb-8">
        <h2 className="text-md font-semibold mb-2">📣 Course Announcements</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Reminder: Guest speaker Friday at 1500 in Bldg 321.</li>
          <li>Group PT moved to Thursday morning, 0600.</li>
          <li>Don’t forget to submit your Week 2 survey by Sunday!</li>
        </ul>
      </div>

      {/* Growth Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Self-Assessment Chart */}
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

        {/* Peer Feedback Chart */}
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
    </div>
  );
}
