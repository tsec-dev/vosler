"use client";

import BaseLayout from "@/components/BaseLayout";
import { FaStar } from "react-icons/fa";
import { useState } from "react";


const sessions = [
  "Risk Analysis and Mitigation",
  "Introduction to Joint Planning",
  "Operational Design",
  "Guest Speaker: CMSgt (Ret) Vosler",
  "Leadership in Complex Environments",
];

export default function CourseSurveyPage() {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateField = (session: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [session]: {
        ...prev[session],
        [field]: value,
      },
    }));
  };

  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold mb-6">📋 Course Survey</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Please provide feedback on the lessons and guest sessions. Your input helps us improve future courses.
      </p>

      <div className="space-y-8">
        {sessions.map((session) => (
          <div
            key={session}
            className="p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow space-y-4"
          >
            <h2 className="text-md font-semibold">{session}</h2>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={formData[session]?.present || false}
                onChange={(e) => updateField(session, "present", e.target.checked)}
              />
              <label className="text-sm">Were you present?</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rate this session (1–10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData[session]?.rating || ""}
                onChange={(e) => updateField(session, "rating", Number(e.target.value))}
                className="w-24 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comments (optional)</label>
              <textarea
                rows={2}
                value={formData[session]?.comments || ""}
                onChange={(e) => updateField(session, "comments", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
                placeholder="Your feedback here..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Final Comments */}
      <div className="mt-10 p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow space-y-4">
        <h2 className="text-md font-semibold">📝 Final Comments</h2>
        <textarea
          rows={3}
          value={formData.finalComments || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, finalComments: e.target.value }))}
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
          placeholder="Any additional suggestions or takeaways?"
        />
      </div>

      {/* Submit */}
      <div className="mt-6">
        <button
          onClick={() => alert("Survey submitted! (placeholder)")}
          className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded-md text-sm transition"
        >
          Submit Course Survey
        </button>
      </div>
    </BaseLayout>
  );
}
