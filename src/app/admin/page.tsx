"use client";

import BaseLayout from "@/components/BaseLayout";
import Link from "next/link";
import { ClipboardList, Settings, FileText } from "lucide-react"; // Optional icons

export default function AdminPage() {
  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🛠️ Admin Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select an option below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/admin/class-management">
          <a className="group bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center min-h-[200px] transition transform hover:-translate-y-1 hover:shadow-2xl">
            <ClipboardList className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold">Class Management</h2>
            <p className="text-sm opacity-80 mt-2 text-center">Create, manage, and invite students to classes.</p>
          </a>
        </Link>

        <Link href="/admin/tools">
          <a className="group bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center min-h-[200px] transition transform hover:-translate-y-1 hover:shadow-2xl">
            <Settings className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold">Admin Tools</h2>
            <p className="text-sm opacity-80 mt-2 text-center">Approve comments, post announcements, and view trends.</p>
          </a>
        </Link>
        <Link href="/admin/survey-results">
          <a className="group bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center transition transform hover:-translate-y-1 hover:shadow-2xl">
            <span className="text-4xl mb-3">📊</span>
            <h2 className="text-xl font-semibold">Survey Results</h2>
            <p className="text-sm opacity-80 mt-2 text-center">View student submissions and aggregated feedback.</p>
          </a>
        </Link>
        <Link href="/admin/survey">
          <a className="group bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center min-h-[200px] transition transform hover:-translate-y-1 hover:shadow-2xl">
            <FileText className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold">Survey Editor</h2>
            <p className="text-sm opacity-80 mt-2 text-center">Customize and manage feedback surveys for students.</p>
          </a>
        </Link>
      </div>
      </div>
    </BaseLayout>
  );
}
