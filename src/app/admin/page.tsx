"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const peerFeedback = [
  {
    student: "Taylor Smith",
    trait: "Leadership",
    comment: "Taylor organized great team-building activities that helped us bond.",
  },
  {
    student: "Taylor Smith",
    trait: "Adaptability",
    comment: "They adapted well to sudden changes and helped the group stay on course.",
  },
  {
    student: "Taylor Smith",
    trait: "Communication",
    comment: "Awesome job leading yesterday’s briefing!",
  },
];

export default function AdminPanel() {
  const [week] = useState(3);

  // Create Class Form State
  const [className, setClassName] = useState("");
  const [numStudents, setNumStudents] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructor, setInstructor] = useState("");

  const handleCreateClass = () => {
    if (!className || !numStudents || !startDate || !endDate || !instructor) {
      alert("Please fill out all fields.");
      return;
    }

    // Placeholder for now — replace with Supabase logic later
    console.log("Creating class:", {
      className,
      numStudents,
      startDate,
      endDate,
      instructor,
    });
    alert("Class created! (Demo mode)");

    // Reset form
    setClassName("");
    setNumStudents("");
    setStartDate("");
    setEndDate("");
    setInstructor("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      {/* Header Buttons */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Weekly Feedback Summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">✅ Weekly Feedback Summary</h2>
            <p className="text-sm">🧑‍🎓 18 of 22 students submitted self-assessments</p>
            <p className="text-sm">👥 16 of 22 submitted peer feedback</p>
            <p className="text-sm text-yellow-400">⚠️ 6 students still need to submit</p>
          </div>

          {/* Top Traits */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">🏅 Top Traits</h2>
            <ul className="list-disc list-inside text-sm">
              <li>Communication</li>
              <li>EQ</li>
              <li>Integrity</li>
            </ul>
          </div>

          {/* Growth Tracker */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">📈 Growth Tracker</h2>
            <div className="mb-3">
              <p className="font-medium text-sm mb-1">Top Improvers</p>
              <ul className="text-sm list-disc list-inside">
                <li>Jamie Chhn – Excels in Communication</li>
                <li>Jamie Walker – Excels in Integrity</li>
                <li>Sam Nguyen – Excels in Boldness</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm mb-1">Needs Support</p>
              <ul className="text-sm list-disc list-inside">
                <li>Chris Dean – Needs support in EQ</li>
                <li>Aliyah Stone – Needs support in Communication</li>
                <li>Mike Ferris – Needs support in Leadership</li>
              </ul>
            </div>
          </div>

          {/* Create New Class */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mt-10">
            <h2 className="text-lg font-semibold mb-4">📚 Create New Class</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class Name</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Delta Flight 23-04"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Students</label>
                <input
                  type="number"
                  value={numStudents}
                  onChange={(e) => setNumStudents(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. 22"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Assigned Instructor</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. MSgt Johnson"
                />
              </div>
            </div>
            <button
              onClick={handleCreateClass}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Class
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-4">🧾 Peer Feedback to Review</h2>
            <div className="space-y-4">
              {peerFeedback.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-center mb-2 text-sm font-medium">
                    <span>{item.student}</span>
                    <span className="text-gray-500 dark:text-gray-400">{item.trait}</span>
                  </div>
                  <p className="italic text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {item.comment}
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm rounded-md">
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
