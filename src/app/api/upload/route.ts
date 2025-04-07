// @ts-expect-error: pdf-parse has no types
import pdfParse from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getAuth } from "@clerk/nextjs/server";

// A static mapping of Gallup strengths to their domains.
const gallupStrengthsDomainMap: { [strength: string]: string } = {
  "Achiever": "Executing",
  "Activator": "Influencing",
  "Adaptability": "Relationship Building",
  "Analytical": "Strategic Thinking",
  "Arranger": "Executing",
  "Belief": "Executing",
  "Command": "Influencing",
  "Communication": "Influencing",
  "Competition": "Influencing",
  "Connectedness": "Relationship Building",
  "Consistency": "Executing",
  "Deliberative": "Executing",
  "Developer": "Relationship Building",
  "Discipline": "Executing",
  "Empathy": "Relationship Building",
  "Focus": "Executing",
  "Futuristic": "Strategic Thinking",
  "Harmony": "Relationship Building",
  "Ideation": "Strategic Thinking",
  "Includer": "Relationship Building",
  "Individualization": "Relationship Building",
  "Input": "Strategic Thinking",
  "Intellection": "Strategic Thinking",
  "Learner": "Strategic Thinking",
  "Maximizer": "Executing",
  "Positivity": "Influencing",
  "Relator": "Relationship Building",
  "Responsibility": "Executing",
  "Restorative": "Executing",
  "Self-Assurance": "Influencing",
  "Significance": "Influencing",
  "Strategic": "Strategic Thinking",
  "Woo": "Influencing",
};

// Function to extract the top 2 Gallup strengths from text.
function extractTopStrengths(text: string): { strength: string; domain: string }[] {
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
  const potentialStrengths = lines.filter(line => /^\d+\.\s+\w+/.test(line));
  const extracted = potentialStrengths.map(line => line.replace(/^\d+\.\s*/, ""));
  const validStrengths = extracted.filter(str => str in gallupStrengthsDomainMap);
  return validStrengths.slice(0, 2).map(strength => ({
    strength,
    domain: gallupStrengthsDomainMap[strength],
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    const snippet = parsed.text.slice(0, 1000);
    const topStrengths = extractTopStrengths(parsed.text);

    const { data: uploadData, error } = await supabase
      .from("uploads")
      .insert([
        {
          student_id: userId,          // Clerk user id as text
          report_type: "gallup",       // Change as needed ("gallup" or "eq")
          parsed_data: { snippet, topStrengths },
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting upload:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "PDF processed and data saved",
      data: uploadData,
    });
  } catch (error: any) {
    console.error("Error in upload route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
