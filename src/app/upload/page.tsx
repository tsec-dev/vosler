"use client";
import { useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center border border-gray-700 rounded-xl p-8 bg-gray-900 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload Your PDF</h1>

        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded w-full inline-block">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name || "No file chosen")
            }
          />
          Choose PDF File
        </label>

        <p className="mt-4 text-sm text-gray-400">
          {fileName ? `📄 ${fileName}` : "No file uploaded yet"}
        </p>

        <p className="mt-6 text-xs text-gray-500">
          PDF parsing and team insight coming soon...
        </p>
      </div>
    </div>
  );
}
