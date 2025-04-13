// app/api/approved-feedback/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetEmail = searchParams.get("targetEmail");

  if (!targetEmail) {
    return NextResponse.json({ error: "Missing targetEmail parameter." }, { status: 400 });
  }

  // Fetch approved feedback for this target email.
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("target_id", targetEmail)
    .eq("approved", true)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching approved feedback:", error);
    return NextResponse.json({ error: "Error fetching approved feedback.", detail: error }, { status: 500 });
  }

  return NextResponse.json(data);
}
