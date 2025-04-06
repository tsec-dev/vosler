// src/app/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Otherwise, show landing page with sign-in link
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Vosler Team Builder</h1>
        <p className="mb-6">Sign in to get started building your mission-ready team</p>
        <Link 
          href="/sign-in" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}