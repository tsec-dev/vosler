"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";

// Define your types
export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export interface StudentProps {
  first_name?: string;
  last_name?: string;
  military_name?: string;
  rank?: string;
  // Additional fields as needed…
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps; // Full profile from the student_profiles view
}

interface TraitData {
  trait: string;
  self: number;
  peer: number;
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientDashboard({ user, student }: DashboardProps): JSX.Element {
  // Use Clerk's useUser hook for reliable access to user data
  const { user: clerkUser, isLoaded } = useUser();

  // Store the classId we extract from Clerk public metadata
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    // Once user data is loaded, extract the class_id from public metadata
    if (isLoaded && clerkUser) {
      // Cast publicMetadata to the expected type so TypeScript understands the structure.
      const meta = clerkUser.publicMetadata as { class_id?: string };
      const classMeta = meta.class_id;
      if (!classMeta) {
        console.warn("classMeta is not defined. Please complete your profile.");
      }
      setClassId(classMeta || null);
    }
  }, [isLoaded, clerkUser]);

  // Use SWR to fetch dashboard data once classId is defined.
  const { data, error, isLoading } = useSWR(
    classId ? `/api/dashboard?classId=${classId}&userEmail=${user.email}` : null,
    fetcher,
    { revalidateOnFocus: true } // refresh when the window regains focus
  );

  // Set sensible defaults
  const weekNumber: number = data?.weekNumber || 1;
  const currentTheme: string = data?.currentTheme || "Growth";
  const traitData: TraitData[] =
    data?.averages?.map((d: any) => ({
      trait: d.category,
      self: d.selfavg || 0,
      peer: d.peeravg || 0,
    })) || [];
  const classmates: any[] = data?.classmates || [];
  const givenFeedback: string[] = (data?.feedback || []).map((r: any) => r.target_user);

  if (!classId) {
    // Inform the user to complete the profile if classId hasn't been set
    return <div>Please complete your profile to see dashboard data.</div>;
  }
  if (error) {
    console.error("SWR error:", error);
    return <div>Error loading dashboard data.</div>;
  }
  if (isLoading || !data) return <div>Loading dashboard...</div>;

  // Helper functions for display names.
  const getWelcomeDisplayName = () => {
    if (student.military_name?.trim()) {
      return student.military_name.trim();
    } else if (student.rank?.trim() && student.last_name?.trim()) {
      return `${student.rank.trim()} ${student.last_name.trim()}`;
    } else if (student.first_name?.trim()) {
      const first = student.first_name.trim();
      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }
    return user.email;
  };

  const getClassmateDisplayName = (s: any): string => {
    if (s.military_name?.trim()) {
      return s.military_name.trim();
    } else if (s.rank?.trim() && s.last_name?.trim()) {
      return `${s.rank.trim()} ${s.last_name.trim()}`;
    } else if (s.first_name?.trim() && s.last_name?.trim()) {
      return `${s.first_name.trim()} ${s.last_name.trim()}`;
    } else if (s.first_name?.trim()) {
      return s.first_name.trim();
    }
    return s.email;
  };

  const displayName = getWelcomeDisplayName();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {displayName}, to Week {weekNumber}: {currentTheme}
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
          {classmates.map((s: any) => {
            const displayStudent = getClassmateDisplayName(s);
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
