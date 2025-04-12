"use client";

import BaseLayout from "@/components/BaseLayout";
import { useUser } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { user } = useUser();

  // Fallback display name if the user data isn’t available yet.
  const displayName = user?.firstName || "User";

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with welcome and quote */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">👋 Welcome, {displayName}</h1>
          <p className="text-lg text-gray-500">
            “Leadership is not about being in charge. It is about taking care of those in your charge.” – Simon Sinek
          </p>
        </header>
        
        {/* Main content - Starting simple */}
        <main>
          <p className="text-xl">Coming Soon...</p>
        </main>
      </div>
    </BaseLayout>
  );
}
