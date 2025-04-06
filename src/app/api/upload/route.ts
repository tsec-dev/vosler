// src/app/api/upload/route.ts

// @ts-expect-error: no types for pdf-parse
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
      snippet: parsed.text.slice(0, 1000),
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
