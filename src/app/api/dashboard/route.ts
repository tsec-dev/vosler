// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
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
      throw new Error("Error fetching class record.");
    }
    console.log("Fetched class record:", classRecord);

    // Helper: calculate current week
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
    let currentTheme = "Growth"; // fallback
    if (classRecord.fellowship_name) {
      const { data: templates, error: templatesError } = await supabase
        .from("fellowship_templates")
        .select("week_number, theme")
        .eq("fellowship_name", classRecord.fellowship_name);
      if (templatesError) {
        console.error("Error fetching fellowship templates:", templatesError);
        throw new Error("Error fetching fellowship templates.");
      }
      if (templates && templates.length > 0) {
        const templateForWeek = templates.find((t: any) => t.week_number === weekNumber);
        if (templateForWeek && templateForWeek.theme) {
          currentTheme = templateForWeek.theme;
        }
      }
    }
    console.log("Current theme:", currentTheme);

    // 3. Fetch self vs. peer averages (update function if needed)
    // (Assuming this part works for you; if not, adjust or comment it out)
    const { data: averages, error: averagesError } = await supabase.rpc("get_self_peer_gaps", {
      target_user: userEmail,
      class_filter: classId,
    });
    if (averagesError) {
      console.error("Error in RPC get_self_peer_gaps:", averagesError);
      throw new Error("Error fetching self-peer data.");
    }
    console.log("Fetched averages:", averages);

    // 4. Fetch classmates (excluding the current user)
    const { data: classmates, error: classmatesError } = await supabase
      .from("student_profiles")
      .select("email, military_name, rank, first_name, last_name, class_id")
      .eq("class_id", classId);
    if (classmatesError) {
      console.error("Error fetching classmates:", classmatesError);
      throw new Error("Error fetching classmates.");
    }
    const filteredClassmates = (classmates || []).filter((s: any) => s.email !== userEmail);
    console.log("Fetched classmates:", filteredClassmates);

    // 5. Fetch feedback responses
    // IMPORTANT: Here we use "target" instead of "target_user" because your table column is different.
    const { data: feedback, error: feedbackError } = await supabase
      .from("survey_responses")
      .select("target")
      .eq("user_id", userEmail)
      .eq("response_type", "peer")
      .eq("class_id", classId);
    if (feedbackError) {
      console.error("Error fetching feedback responses:", feedbackError);
      throw new Error("Error fetching feedback responses.");
    }
    console.log("Fetched feedback responses:", feedback);

    const responseData = {
      classRecord,
      weekNumber,
      currentTheme,
      averages,
      classmates: filteredClassmates,
      feedback, // expecting an array of objects with key "target"
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
