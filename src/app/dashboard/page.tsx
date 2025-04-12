"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.publicMetadata?.role === "admin") {
      setIsAdmin(true);
    }
  }, [user]);

  const name = user?.firstName || "Student";

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10">
      <div>
        <h1 className="text-2xl font-bold">👋 Welcome, {name}, to Week 1: Architect</h1>
        <p className="text-center italic text-gray-400 mt-2">
          “Leadership is not about being in charge. It is about taking care of those in your charge.” — Simon Sinek
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Self Chart */}
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">📊 Your Self Assessment</h2>
          {/* Replace with real chart */}
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            [Self Bar Chart Placeholder]
          </div>
        </div>

        {/* Peer Chart */}
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">👥 Peer Feedback</h2>
          {/* Replace with real chart */}
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            [Peer Bar Chart Placeholder]
          </div>
        </div>
      </div>

      {/* Feedback To-Dos */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">📝 Feedback Tasks</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {["Teammate A", "Teammate B", "Instructor"].map((name, idx) => (
            <div
              key={idx}
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-md flex flex-col items-center justify-between"
            >
              <span className="text-sm">{name}</span>
              <Link
                href="#"
                className="mt-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded"
              >
                Go to Feedback
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Panel Link */}
      {isAdmin && (
        <div className="text-right">
          <Link
            href="/admin"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded"
          >
            Instructor Panel
          </Link>
        </div>
      )}
    </div>
  );
}
