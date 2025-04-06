import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Vosler | Mission-Ready Team Builder
      </h1>
      <p className="mb-8 text-gray-400 text-center max-w-md">
        Upload your CliftonStrengths & EQ report. We’ll handle the rest.
        Smart, balanced teams. Built with brain and heart.
      </p>
      <Link
        href="/upload"
        className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl font-medium text-white"
      >
        Upload My PDF
      </Link>
    </main>
  );
}
