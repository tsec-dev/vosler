"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
  // you can include rank if needed—but we expect the student profile to have military_name
  rank?: string;
}

export interface StudentProps {
  first_name: string;
  last_name: string;
  military_name?: string;
  // Optionally, you might also include rank if needed:
  rank?: string;
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps;
}

interface TraitData {
  trait: string;
  self: number;
  peer: number;
}

// Instead of capitalizing first name, we can create a helper
// for combining military_name or falling back to first name.
function getDisplayName(student: StudentProps, user: UserProps): string {
  if (student.military_name && student.military_name.trim() !== "") {
    // Use the military_name from the profile (e.g. "Captain Smith")
    return student.military_name;
  }
  // Otherwise, fall back to capitalizing the first name.
  const name = student.first_name || user.firstName;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function ClientDashboard({ user, student }: DashboardProps): JSX.Element {
  const displayName = getDisplayName(student, user);
  
  const [traitData, setTraitData] = useState<TraitData[]>([]);
  const [classmates, setClassmates] = useState<any[]>([]);
  const [givenFeedback, setGivenFeedback] = useState<string[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentTheme, setCurrentTheme] = useState<string>("Growth"); // Fallback theme

  // Helper function to compute the current week based on the class start_date.
  function calculateCurrentWeek(start: string): number {
    const sDate = new Date(start);
    const now = new Date();
    const diff = now.getTime() - sDate.getTime();
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return weeks;
  }

  useEffect(() => {
    // Get the class ID from Clerk's public metadata.
    const classMeta = (window as any).Clerk?.user?.publicMetadata?.class_id;
    setClassId(classMeta);

    if (classMeta) {
      // Fetch class record to obtain start_date and fellowship_name.
      supabase
        .from("classes")
        .select("start_date, fellowship_name")
        .eq("id", classMeta)
        .single()
        .then(({ data, error }) => {
          if (data && data.start_date) {
            const weekNumber = calculateCurrentWeek(data.start_date);
            setCurrentWeek(weekNumber);
            // Query the fellowship_templates table to get themes for this fellowship.
            if (data.fellowship_name) {
              supabase
                .from("fellowship_templates")
                .select("week_number, theme")
                .eq("fellowship_name", data.fellowship_name)
                .then(({ data: templates, error: templatesError }) => {
                  if (templatesError) {
                    console.error("Error fetching fellowship themes:", templatesError);
                    setCurrentTheme("Growth");
                  }
                  if (templates && templates.length > 0) {
                    const templateForWeek = templates.find(
                      (t: any) => t.week_number === weekNumber
                    );
                    if (templateForWeek && templateForWeek.theme) {
                      setCurrentTheme(templateForWeek.theme);
                    } else {
                      setCurrentTheme("Growth");
                    }
                  } else {
                    setCurrentTheme("Growth");
                  }
                });
            }
          }
        });

      // Load trait averages (Self vs Peer Chart)
      supabase
        .rpc("get_self_peer_avg_by_category", {
          target_user: user.email,
          class_filter: classMeta,
        })
        .then(({ data }) => {
          if (data) {
            setTraitData(
              data.map((d: any) => ({
                trait: d.category,
                self: d.selfavg || 0,
                peer: d.peeravg || 0,
              }))
            );
          }
        });

      // Load classmates.
      // Here we assume your view 'student_profiles' is used to return enhanced profile info.
      supabase
        // Adjust the table name if necessary; this query expects a record with:
        // email, military_name, first_name, last_name, and optionally rank.
        .from("student_profiles")
        .select("email, military_name, first_name, last_name, rank")
        .eq("class_id", classMeta)
        .then(({ data }) => {
          // Filter out the current user's email.
          const others = (data || []).filter((s: any) => s.email !== user.email);
          setClassmates(others);
        });

      // Load submitted feedback (to identify classmates already reviewed)
      supabase
        .from("survey_responses")
        .select("target_user_id")
        .eq("user_id", user.email)
        .eq("response_type", "peer")
        .eq("class_id", classMeta)
        .then(({ data }) => {
          if (data) {
            setGivenFeedback(data.map((r: any) => r.target_user_id));
          }
        });
    }
  }, [user.email]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {displayName}, to Week {currentWeek}: {currentTheme}
      </h1>

      {/* Self vs Peer Averages Chart */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          📊 Self vs Peer Averages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {traitData.map(({ trait, self, peer }) => (
            <div key={trait}>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{trait}</p>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex">
                <motion.div
                  className="bg-indigo-500"
                  style={{ width: `${self * 20}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${self * 20}%` }}
                />
                <motion.div
                  className="bg-green-500"
                  style={{ width: `${peer * 20}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${peer * 20}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-400">You: {self}/5 | Peers: {peer}/5</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classmate Feedback Section */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">👥 Classmates to Review</h2>
        {classmates.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All feedback complete or no classmates found.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classmates.map((s) => {
            // Construct a display string using military_name if available;
            // otherwise build it from rank, first_name, and last_name.
            const displayStudent = s.military_name && s.military_name.trim() !== ""
              ? s.military_name
              : s.rank && s.first_name && s.last_name
              ? `${s.rank} ${s.first_name} ${s.last_name}`
              : s.email;
            return (
              <div key={s.email} className="p-4 border rounded bg-gray-100 dark:bg-gray-800 text-sm">
                <p className="mb-2">{displayStudent}</p>
                <button
                  className={`w-full px-3 py-1 rounded text-sm font-medium transition ${
                    givenFeedback.includes(s.email)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                  disabled={givenFeedback.includes(s.email)}
                  onClick={() => alert(`Open peer feedback modal for ${displayStudent}`)}
                >
                  {givenFeedback.includes(s.email) ? "✅ Feedback Given" : "Give Feedback"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
