import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

// Ensure you install pdf-parse if you haven't:
  // npm install pdf-parse

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdfParse(buffer);

  return NextResponse.json({
    name: file.name,
    snippet: parsed.text.slice(0, 1000), // just return the first part for now
  });
}
