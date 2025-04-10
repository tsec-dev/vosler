"use client";

import { useEffect, useState } from "react";

const mockStudents = [
  { name: "Alex Rivera", growth: 1.2, avg: 4.6, topTrait: "Leadership", lowTrait: "EQ" },
  { name: "Jamie Chen", growth: -0.8, avg: 2.9, topTrait: "Boldness", lowTrait: "Communication" },
  { name: "Taylor Smith", growth: 0.4, avg: 3.8, topTrait: "Comm", lowTrait: "Self-Awareness" },
];

const mockQuotes = [
  "Alex really stepped up this week and led the group through a tough challenge.",
  "Jamie has great insight, just needs to speak up more in discussions.",
  "Taylor asked thoughtful questions and helped build team trust.",
];

export default function AdminPanel() {
  const [week, setWeek] = useState(3); // change manually for demo

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white p-8">
      <h1 className="text-2xl font-bold mb-6">📋 Instructor Panel – Week {week}</h1>

      {/* Feedback Summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">✅ Weekly Feedback Summary</h2>
        <p className="text-sm mb-1">🧑‍🎓 18 of 22 students submitted self-assessments</p>
        <p className="text-sm mb-1">👥 16 of 22 submitted peer feedback</p>
        <p className="text-sm text-yellow-400">⚠️ 6 students still need to submit</p>
      </div>

      {/* Growth Tracker */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">📈 Growth Tracker</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs border-b dark:border-gray-700">
              <th className="py-2">Name</th>
              <th>Growth Δ</th>
              <th>Last Week Avg</th>
              <th>Top Trait</th>
              <th>Low Trait</th>
            </tr>
          </thead>
          <tbody>
            {mockStudents.map((s, idx) => (
              <tr key={idx} className="border-b dark:border-gray-700">
                <td className="py-2">{s.name}</td>
                <td className={s.growth < 0 ? "text-red-500" : "text-green-500"}>
                  {s.growth > 0 ? "📈" : "📉"} {s.growth}
                </td>
                <td>{s.avg}</td>
                <td>{s.topTrait}</td>
                <td>{s.lowTrait}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Traits */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">🏅 Top Traits</h2>
        <ul className="list-disc list-inside text-sm">
          <li>Leadership: Alex Rivera (4.9)</li>
          <li>Communication: Taylor Smith (4.7)</li>
          <li>Boldness: Jamie Chen (4.5)</li>
        </ul>
      </div>

      {/* Peer Quotes */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">💬 Peer Feedback Highlights</h2>
        <ul className="text-sm space-y-2">
          {mockQuotes.map((q, i) => (
            <li key={i} className="italic text-gray-700 dark:text-gray-300">“{q}”</li>
          ))}
        </ul>
      </div>

      {/* Exports & Reset */}
      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm">
          📁 Export Weekly Report
        </button>
        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm">
          🧼 Reset for New Course
        </button>
      </div>
    </div>
  );
}
