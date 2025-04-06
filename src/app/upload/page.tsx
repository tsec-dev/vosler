"use client";
import { useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center border border-gray-700 rounded-xl p-8 bg-gray-900 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload Your PDF</h1>

        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded w-full inline-block">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFileName(file.name);
                handleUpload(file);
              }
            }}
          />
          Choose PDF File
        </label>

        <p className="mt-4 text-sm text-gray-400">
          {fileName ? `📄 ${fileName}` : "No file uploaded yet"}
        </p>

        {uploading && <p className="text-yellow-400 mt-4">Uploading...</p>}

        {result && (
          <div className="mt-6 text-left text-sm bg-gray-800 p-4 rounded">
            <strong className="block mb-2 text-green-400">Parsed Result:</strong>
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
