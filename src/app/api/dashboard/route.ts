import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // Parse query parameters
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

    // 3. Fetch dynamic self vs. peer averages using our RPC function
    const { data: averagesRaw, error: averagesError } = await supabase.rpc("get_dynamic_self_peer_averages", {
      p_class_id: classId,
      p_user_email: userEmail,
    });
    
    if (averagesError) {
      console.error("Error in RPC get_dynamic_self_peer_averages:", averagesError);
      return NextResponse.json(
        { error: "Error fetching self-peer data.", detail: averagesError },
        { status: 500 }
      );
    }
    
    // Process the averages to ensure they have the expected format
    const safeAverages = (averagesRaw || []).map((item: any) => ({
      category: item.category || 'Unknown',
      selfavg: typeof item.selfavg === 'number' ? item.selfavg : 0,
      peeravg: typeof item.peeravg === 'number' ? item.peeravg : 0,
      gap: typeof item.gap === 'number' ? item.gap : 0,
    }));
    
    console.log("Processed averages:", safeAverages);

    // 4. Fetch classmates (excluding current user) from student_profiles
    const { data: classmates, error: classmatesError } = await supabase
      .from("student_profiles")
      .select("id, email, military_name, rank, first_name, last_name, class_id")
      .eq("class_id", classId);

    if (classmatesError) {
      console.error("Error fetching classmates:", classmatesError);
      return NextResponse.json(
        { error: "Error fetching classmates.", detail: classmatesError },
        { status: 500 }
      );
    }
    // Exclude the current user from classmates
    const filteredClassmates = (classmates || []).filter(
      (s: any) => s.email !== userEmail
    );
    console.log("Fetched classmates:", filteredClassmates);

    // 4.1. Fetch self survey responses for these classmates
    const { data: selfResponses, error: selfResponsesError } = await supabase
      .from("survey_responses")
      .select("user_id, id")
      .in("user_id", filteredClassmates.map((s: any) => s.email));
      
    if (selfResponsesError) {
      console.error("Error fetching self responses:", selfResponsesError);
      // Optionally continue even if self survey fetching fails
    }
    console.log("Fetched self survey responses:", selfResponses);

    // Merge self survey response IDs into classmates
    const classmatesWithSelf = filteredClassmates.map((s: any) => {
      const selfResponse = (selfResponses || []).find(
        (r: any) => r.user_id === s.email
      );
      return { ...s, selfResponseId: selfResponse ? selfResponse.id : null };
    });
    console.log("Updated classmates with selfResponseId:", classmatesWithSelf);

    // 5. Fetch feedback responses (peer feedback) from the feedback table.
    // Here, we're matching feedback submitted by the current user.
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedback")
      .select("target_id")
      .eq("submitted_by", userEmail)
      .eq("target_type", "peer");

    if (feedbackError) {
      console.error("Error fetching feedback responses:", feedbackError);
      return NextResponse.json(
        { error: "Error fetching feedback responses.", detail: feedbackError },
        { status: 500 }
      );
    }
    console.log("Fetched feedback responses:", feedback);

    // Prepare the aggregated response data
    const responseData = {
      classRecord,
      weekNumber,
      currentTheme,
      averages: safeAverages,
      classmates: classmatesWithSelf, // includes selfResponseId if present
      feedback: feedback || [],       // ensure feedback is an array
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
