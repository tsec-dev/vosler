// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Vosler Team Builder</h1>
        <p className="mb-6">Sign in to get started building your mission-ready team</p>
        <a 
          href="/sign-in" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}