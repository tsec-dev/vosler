// The issue with your 404 error likely comes from incorrect file structure or routing in Next.js

// PROBLEM: The page.tsx file might be in the wrong location or your Next.js routing isn't set up correctly

// SOLUTION: Ensure your directory structure follows Next.js App Router conventions:
// src/
// ├── app/
// │   ├── page.tsx (homepage route - "/")
// │   ├── layout.tsx (optional root layout)
// │   ├── upload/
// │   │   └── page.tsx (upload route - "/upload")

// Here's the corrected version of your root page.tsx:

// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Vosler | Mission-Ready Team Builder
      </h1>
      <p className="mb-8 text-gray-400 text-center max-w-md">
        Upload your CliftonStrengths & EQ report. We'll handle the rest.
        Smart, balanced teams. Built with brain and heart.
      </p>
      <Link 
        href="/upload"
        className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl font-medium"
      >
        Upload My PDF
      </Link>
    </main>
  );
}

