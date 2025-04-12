"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export interface StudentProps {
  first_name: string;
  last_name: string;
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps;
  week?: number;
}

interface TraitData {
  trait: string;
  self: number;
  peer: number;
}

function capitalizeFirstName(name?: string): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const weekThemes = ["Architect", "Foundation", "Reflection", "Execution"];

export default function ClientDashboard({ user, student, week = 2 }: DashboardProps): JSX.Element {
  const displayName = capitalizeFirstName(student.first_name || user.firstName);
  const weekTheme = weekThemes[week - 1] || "Growth";

  const [traitData, setTraitData] = useState<TraitData[]>([]);
  const [classmates, setClassmates] = useState<any[]>([]);
  const [givenFeedback, setGivenFeedback] = useState<string[]>([]);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    const classMeta = (window as any).Clerk?.user?.publicMetadata?.class_id;
    setClassId(classMeta);

    if (classMeta) {
      // Load trait averages
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

      // Load classmates
      supabase
        .from("class_students")
        .select("email")
        .eq("class_id", classMeta)
        .then(({ data }) => {
          const others = (data || []).filter((s: any) => s.email !== user.email);
          setClassmates(others);
        });

      // Load submitted feedback (to classmates)
      supabase
        .from("survey_responses")
        .select("target_user_id")
        .eq("user_id", user.email)
        .eq("response_type", "peer")
        .eq("class_id", classMeta)
        .then(({ data }) => {
          if (data) {
            setGivenFeedback(data.map((r) => r.target_user_id));
          }
        });
    }
  }, [user.email]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {displayName}, to Week {week}: {weekTheme}
      </h1>

      {/* Self vs Peer Chart */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">📊 Self vs Peer Averages</h2>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">All feedback complete or no classmates found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classmates.map((s) => (
            <div key={s.email} className="p-4 border rounded bg-gray-100 dark:bg-gray-800 text-sm">
              <p className="mb-2">{s.email}</p>
              <button
                className={`w-full px-3 py-1 rounded text-sm font-medium transition ${
                  givenFeedback.includes(s.email)
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
                disabled={givenFeedback.includes(s.email)}
                onClick={() => alert(`Open peer feedback modal for ${s.email}`)}
              >
                {givenFeedback.includes(s.email) ? "✅ Feedback Given" : "Give Feedback"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
