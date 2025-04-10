"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const peerFeedback = [
  {
    student: "Taylor Smith",
    trait: "Leadership",
    comment: "Taylor organized great team—building activities that helped us bond.",
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-6">
      {/* Header Buttons */}
      <div className="flex justify-between mb-6 items-start">
        <div className="flex flex-col gap-2">
          <a
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            ← Return to Dashboard
          </a>
        </div>
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
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">✅ Weekly Feedback Summary</h2>
            <p className="text-sm">🧑‍🎓 18 of 22 students submitted self-assessments</p>
            <p className="text-sm">👥 16 of 22 submitted peer feedback</p>
            <p className="text-sm text-yellow-400">⚠️ 6 students still need to submit</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">🏅 Top Traits</h2>
            <ul className="list-disc list-inside text-sm">
              <li>Communication</li>
              <li>EQ</li>
              <li>Integrity</li>
            </ul>
          </div>

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
