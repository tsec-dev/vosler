"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";

export default function AdminPanel() {
  const [classCreated, setClassCreated] = useState(false);
  const [className, setClassName] = useState("");
  const [numStudents, setNumStudents] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructor, setInstructor] = useState("");

  const [studentEmail, setStudentEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleCreateClass = () => {
    if (!className || !numStudents || !startDate || !endDate || !instructor) {
      alert("Please fill out all fields.");
      return;
    }
    setClassCreated(true);
  };

  const handleInvite = () => {
    if (!studentEmail.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    setInvitedEmails((prev) => [...prev, studentEmail]);
    setStudentEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-12">
      <AnimatePresence>
        {!classCreated && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold text-center mb-4">🎓 Create Your Class</h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Start by creating your course session and assigning an instructor.
            </p>
            <div className="space-y-4">
              <input
                placeholder="Class Name"
                className="input"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Number of Students"
                className="input"
                value={numStudents}
                onChange={(e) => setNumStudents(Number(e.target.value))}
              />
              <input
                type="date"
                placeholder="Start Date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="End Date"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                placeholder="Instructor Name"
                className="input"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
              <button
                onClick={handleCreateClass}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium transition"
              >
                Create Class
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {classCreated && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Top Bar */}
          <div className="flex justify-between mb-6 items-start">
            <a
              href="/dashboard"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              ← Return to Dashboard
            </a>
            <div className="flex flex-col items-end gap-2">
              <UserButton afterSignOutUrl="/" />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
                Export to PDF
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium">
                Reset for next class
              </button>
            </div>
          </div>

          {/* Invite Students */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow p-6 mb-10">
            <h2 className="text-lg font-semibold mb-4">✉️ Invite Students</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                placeholder="Enter student email"
              />
              <button
                onClick={handleInvite}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Send Invite
              </button>
            </div>
            <button className="text-sm text-blue-500 underline mb-2">
              Or upload Excel to import students
            </button>
            {invitedEmails.length > 0 && (
              <ul className="mt-4 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {invitedEmails.map((email, idx) => <li key={idx}>{email}</li>)}
              </ul>
            )}
          </div>

          {/* Placeholder for full dashboard */}
          <div className="text-center text-sm text-gray-400">✨ Dashboard content coming next…</div>
        </motion.div>
      )}
    </div>
  );
}
