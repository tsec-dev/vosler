"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseLayout from "@/components/BaseLayout";

export default function AdminPanel() {
  const [classCreated, setClassCreated] = useState(false);
  const [doneInviting, setDoneInviting] = useState(false);
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

  const inputStyles =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400";

  return (
    <BaseLayout showBackToDashboard isAdmin>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <AnimatePresence>
          {!classCreated && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold text-center mb-4">🎓 Create Your Class</h2>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                Start by creating your course session and assigning an instructor.
              </p>
              <div className="space-y-4">
                <input placeholder="Class Name" className={inputStyles} value={className} onChange={(e) => setClassName(e.target.value)} />
                <input type="number" placeholder="Number of Students" className={inputStyles} value={numStudents} onChange={(e) => setNumStudents(Number(e.target.value))} />
                <input type="date" className={inputStyles} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className={inputStyles} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <input placeholder="Instructor Name" className={inputStyles} value={instructor} onChange={(e) => setInstructor(e.target.value)} />
                <button onClick={handleCreateClass} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium transition">
                  Create Class
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* You can leave the rest of your classCreated & invite code below unchanged */}
      </div>
    </BaseLayout>
  );
}
