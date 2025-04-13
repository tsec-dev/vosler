// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // Parse query parameters from the URL
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const userEmail = searchParams.get("userEmail");

  console.log("API GET /dashboard called with:", { classId, userEmail });

  if (!classId || !userEmail) {
    console.error("Missing classId or userEmail parameter.");
    return NextResponse.json(
      { error: "Missing classId or userEmail parameter." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch class record (start_date & fellowship_name)
    const { data: classRecord, error: classError } = await supabase
      .from("classes")
      .select("start_date, fellowship_name")
      .eq("id", classId)
      .single();

    if (classError || !classRecord) {
      console.error("Error fetching class record:", classError);
      return NextResponse.json(
        { error: "Error fetching class record.", detail: classError },
        { status: 500 }
      );
    }
    console.log("Fetched class record:", classRecord);

    // Helper: calculate current week based on start_date
    const calculateCurrentWeek = (start: string): number => {
      const sDate = new Date(start);
      const now = new Date();
      const diff = now.getTime() - sDate.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    };
    const weekNumber = classRecord.start_date
      ? calculateCurrentWeek(classRecord.start_date)
      : 1;

    // 2. Fetch fellowship templates to determine the theme
    let currentTheme = "Growth"; // fallback theme
    if (classRecord.fellowship_name) {
      const { data: templates, error: templatesError } = await supabase
        .from("fellowship_templates")
        .select("week_number, theme")
        .eq("fellowship_name", classRecord.fellowship_name);

      if (templatesError) {
        console.error("Error fetching fellowship templates:", templatesError);
        return NextResponse.json(
          { error: "Error fetching fellowship templates.", detail: templatesError },
          { status: 500 }
        );
      }

      if (templates && templates.length > 0) {
        const templateForWeek = templates.find(
          (t: any) => t.week_number === weekNumber
        );
        if (templateForWeek && templateForWeek.theme) {
          currentTheme = templateForWeek.theme;
        }
      }
    }
    console.log("Current theme:", currentTheme);

    // 3. Fetch self vs. peer averages using RPC
    const { data: averages, error: averagesError } = await supabase.rpc("get_self_peer_gaps", {
      class_filter: classId,
    });
    if (averagesError) {
      console.error("Error in RPC get_self_peer_gaps:", averagesError);
      return NextResponse.json(
        { error: "Error fetching self-peer data.", detail: averagesError },
        { status: 500 }
      );
    }
    // If no surveys have been completed, averages may be null.
    // Ensure we return an empty array to maintain a consistent data structure.
    const safeAverages = averages || [];
    console.log("Fetched averages (safe):", safeAverages);

    // 4. Fetch classmates (excluding the current user)
    const { data: classmates, error: classmatesError } = await supabase
      .from("student_profiles")
      .select("email, military_name, rank, first_name, last_name, class_id")
      .eq("class_id", classId);

    if (classmatesError) {
      console.error("Error fetching classmates:", classmatesError);
      return NextResponse.json(
        { error: "Error fetching classmates.", detail: classmatesError },
        { status: 500 }
      );
    }
    const filteredClassmates = (classmates || []).filter(
      (s: any) => s.email !== userEmail
    );
    console.log("Fetched classmates:", filteredClassmates);

    // 5. Fetch feedback responses
    const { data: feedback, error: feedbackError } = await supabase
      .from("survey_responses")
      .select("target")
      .eq("user_id", userEmail)
      .eq("response_type", "peer")
      .eq("class_id", classId);

    if (feedbackError) {
      console.error("Error fetching feedback responses:", feedbackError);
      return NextResponse.json(
        { error: "Error fetching feedback responses.", detail: feedbackError },
        { status: 500 }
      );
    }
    console.log("Fetched feedback responses:", feedback);

    // Prepare aggregated response data
    const responseData = {
      classRecord,
      weekNumber,
      currentTheme,
      averages: safeAverages,
      classmates: filteredClassmates,
      feedback,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
