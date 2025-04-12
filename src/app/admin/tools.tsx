"use client";

import BaseLayout from "@/components/BaseLayout";
import { useState } from "react";
import SurveyEditor from "@/components/SurveyEditor"; // We'll define this component below

export default function AdminTools() {
  // Using a simple state to switch between tools
  const [activeTool, setActiveTool] = useState<"survey" | "comments" | "announcements" | "trends">("survey");

  return (
    <BaseLayout showBackToDashboard isAdmin>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Tools</h1>
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTool("survey")} className={`py-2 px-4 rounded ${activeTool === "survey" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
            Edit Survey
          </button>
          <button onClick={() => setActiveTool("comments")} className={`py-2 px-4 rounded ${activeTool === "comments" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
            Approve Comments
          </button>
          <button onClick={() => setActiveTool("announcements")} className={`py-2 px-4 rounded ${activeTool === "announcements" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
            Course Announcements
          </button>
          <button onClick={() => setActiveTool("trends")} className={`py-2 px-4 rounded ${activeTool === "trends" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
            Trend Items
          </button>
        </div>

        {activeTool === "survey" && <SurveyEditor />}
        {activeTool === "comments" && (
          <div>
            <h2 className="text-xl font-semibold">Approve Comments</h2>
            {/* Placeholder: Approve comment UI here */}
            <p>Comment approval functionality coming soon.</p>
          </div>
        )}
        {activeTool === "announcements" && (
          <div>
            <h2 className="text-xl font-semibold">Course Announcements</h2>
            {/* Placeholder: Course announcement UI here */}
            <p>Course announcement functionality coming soon.</p>
          </div>
        )}
        {activeTool === "trends" && (
          <div>
            <h2 className="text-xl font-semibold">Trend Items</h2>
            {/* Placeholder: Trend items UI here */}
            <p>Trend items functionality coming soon.</p>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
