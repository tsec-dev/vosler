// @ts-expect-error: pdf-parse has no TypeScript types
import pdfParse from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    return NextResponse.json({
      name: file.name,
      snippet: parsed.text.slice(0, 1000), // Return the first 1000 characters as a preview
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process PDF." }, { status: 500 });
  }
}
