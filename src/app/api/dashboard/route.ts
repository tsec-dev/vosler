// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // Parse query parameters from the URL.
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const userEmail = searchParams.get("userEmail");

  if (!classId || !userEmail) {
    return NextResponse.json({ error: "Missing classId or userEmail parameter." }, { status: 400 });
  }

  try {
    // 1. Fetch class record (start_date & fellowship_name)
    const { data: classRecord, error: classError } = await supabase
      .from("classes")
      .select("start_date, fellowship_name")
      .eq("id", classId)
      .single();
    if (classError || !classRecord) throw classError || new Error("Class record not found");

    // Helper: calculate current week
    const calculateCurrentWeek = (start: string): number => {
      const sDate = new Date(start);
      const now = new Date();
      const diff = now.getTime() - sDate.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    };
    const weekNumber = classRecord.start_date ? calculateCurrentWeek(classRecord.start_date) : 1;

    // 2. Fetch fellowship theme based on the week number.
    let currentTheme = "Growth"; // fallback theme
    if (classRecord.fellowship_name) {
      const { data: templates, error: templatesError } = await supabase
        .from("fellowship_templates")
        .select("week_number, theme")
        .eq("fellowship_name", classRecord.fellowship_name);
      if (templatesError) throw templatesError;
      if (templates && templates.length > 0) {
        const templateForWeek = templates.find((t: any) => t.week_number === weekNumber);
        if (templateForWeek && templateForWeek.theme) {
          currentTheme = templateForWeek.theme;
        }
      }
    }

    // 3. Fetch self vs. peer averages.
    const { data: averages, error: averagesError } = await supabase.rpc("get_self_peer_avg_by_category", {
      target_user: userEmail,
      class_filter: classId,
    });
    if (averagesError) throw averagesError;

    // 4. Fetch classmates (excluding the current user).
    const { data: classmates, error: classmatesError } = await supabase
      .from("student_profiles")
      .select("email, military_name, rank, first_name, last_name, class_id")
      .eq("class_id", classId);
    if (classmatesError) throw classmatesError;
    const filteredClassmates = (classmates || []).filter((s: any) => s.email !== userEmail);

    // 5. Fetch feedback responses.
    const { data: feedback, error: feedbackError } = await supabase
      .from("survey_responses")
      .select("target_user")
      .eq("user_id", userEmail)
      .eq("response_type", "peer")
      .eq("class_id", classId);
    if (feedbackError) throw feedbackError;

    const responseData = {
      classRecord,
      weekNumber,
      currentTheme,
      averages,
      classmates: filteredClassmates,
      feedback,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
