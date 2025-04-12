"use client";

import BaseLayout from "@/components/BaseLayout";
import Link from "next/link";

export default function AdminPage() {
  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-lg mb-6">
          Welcome to the Admin Dashboard. Select one of the options below to manage your data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/admin/class-management">
            <a className="block bg-indigo-600 hover:bg-indigo-500 text-white text-center py-4 rounded-lg shadow-md">
              Class Management
            </a>
          </Link>
          <Link href="/admin/tools">
            <a className="block bg-indigo-600 hover:bg-indigo-500 text-white text-center py-4 rounded-lg shadow-md">
              Admin Tools
            </a>
          </Link>
          <Link href="/admin/survey">
            <a className="block bg-indigo-600 hover:bg-indigo-500 text-white text-center py-4 rounded-lg shadow-md">
              Survey Editor
            </a>
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
}
