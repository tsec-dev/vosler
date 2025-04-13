import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetEmail = searchParams.get("targetEmail");

  if (!targetEmail) {
    return NextResponse.json(
      { error: "Missing targetEmail parameter." },
      { status: 400 }
    );
  }

  try {
    // Query approved peer feedback for the given target email.
    const { data, error } = await supabase
      .from("feedback")
      .select("id, comments as comment_text, ratings as rating, category, submitted_at")
      .eq("approved", true)
      .eq("target_id", targetEmail)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback comments:", error);
      return NextResponse.json(
        { error: "Error fetching feedback comments.", detail: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
