// pages/api/dashboard.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { classId, userEmail } = req.query;

  if (!classId || !userEmail) {
    res.status(400).json({ error: "Missing classId or userEmail parameter." });
    return;
  }

  try {
    // 1. Fetch class record (start_date & fellowship_name).
    const { data: classRecord, error: classError } = await supabase
      .from("classes")
      .select("start_date, fellowship_name")
      .eq("id", classId)
      .single();
    if (classError) throw classError;

    // Compute week number from the start_date.
    const calculateCurrentWeek = (start: string): number => {
      const sDate = new Date(start);
      const now = new Date();
      const diff = now.getTime() - sDate.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    };
    const weekNumber = classRecord?.start_date ? calculateCurrentWeek(classRecord.start_date) : 1;

    // 2. Fetch fellowship templates to get the current theme.
    let currentTheme = "Growth"; // fallback
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

    // 3. Load self vs. peer averages.
    const { data: averages, error: averagesError } = await supabase.rpc("get_self_peer_avg_by_category", {
      target_user: userEmail,
      class_filter: classId,
    });
    if (averagesError) throw averagesError;

    // 4. Load classmates (excluding the current user).
    const { data: classmates, error: classmatesError } = await supabase
      .from("student_profiles")
      .select("email, military_name, rank, first_name, last_name, class_id")
      .eq("class_id", classId);
    if (classmatesError) throw classmatesError;
    const filteredClassmates = (classmates || []).filter((s: any) => s.email !== userEmail);

    // 5. Load feedback responses.
    const { data: feedback, error: feedbackError } = await supabase
      .from("survey_responses")
      .select("target_user")
      .eq("user_id", userEmail)
      .eq("response_type", "peer")
      .eq("class_id", classId);
    if (feedbackError) throw feedbackError;

    res.status(200).json({
      classRecord,
      weekNumber,
      currentTheme,
      averages,
      classmates: filteredClassmates,
      feedback,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
