// src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.firstName} 👋</h1>
          <p className="text-gray-400 text-sm">
            This is your mission access portal. Upload reports and view team info below.
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* Upload Placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">📤 Upload Reports</h2>
            <p className="text-gray-400 text-sm mb-4">
              Upload your Gallup Strengths and EQ PDFs here.
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-400 text-sm text-center">
              Upload component coming soon...
            </div>
          </div>

          {/* Team Info Placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">👥 My Team</h2>
            <p className="text-gray-400 text-sm mb-4">
              View team members assigned to your JPP project.
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-400 text-sm text-center">
              Team dashboard coming soon...
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
