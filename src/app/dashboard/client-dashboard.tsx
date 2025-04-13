"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import FeedbackModal from "@/components/FeedbackModal";

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export interface StudentProps {
  first_name?: string;
  last_name?: string;
  military_name?: string; // no longer used for display
  rank?: string;
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps; // Full profile from the student_profiles view
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientDashboard({ user, student }: DashboardProps): JSX.Element {
  const { user: clerkUser, isLoaded } = useUser();
  const [classId, setClassId] = useState<string | null>(null);
  
  // Modal state for peer feedback
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [modalTargetEmail, setModalTargetEmail] = useState("");
  const [modalSelfResponseId, setModalSelfResponseId] = useState("");

  // Extract class_id from Clerk metadata when loaded
  useEffect(() => {
    if (isLoaded && clerkUser) {
      const meta = clerkUser.publicMetadata as { class_id?: string };
      const classMeta = meta.class_id;
      if (!classMeta) {
        console.warn("classMeta is not defined. Please complete your profile.");
      }
      setClassId(classMeta || null);
    }
  }, [isLoaded, clerkUser]);

  // SWR fetch for dashboard data
  const { data, error, isLoading } = useSWR(
    classId ? `/api/dashboard?classId=${classId}&userEmail=${user.email}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  const givenFeedback: string[] = (data?.feedback || []).map((r: any) => r.target_id);
  const weekNumber: number = data?.weekNumber || 1;
  const currentTheme: string = data?.currentTheme || "Growth";

  const getWelcomeDisplayName = () => {
    if (student.rank?.trim() && student.first_name?.trim() && student.last_name?.trim()) {
      return `${student.rank.trim()} ${student.first_name.trim()} ${student.last_name.trim()}`;
    }
    if (student.first_name?.trim()) {
      const first = student.first_name.trim();
      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }
    return user.email;
  };

  const getClassmateFullDisplayInfo = (s: any): string => {
    if (s.rank?.trim() && s.first_name?.trim() && s.last_name?.trim()) {
      return `${s.rank.trim()} ${s.first_name.trim()} ${s.last_name.trim()}`;
    }
    return s.email;
  };

  // Open the peer feedback modal: set target's email and selfResponseId
  const openFeedbackModal = (classmate: any) => {
    // Assume that your API now returns a selfResponseId for each classmate
    if (!classmate.selfResponseId) {
      alert("This classmate hasn't submitted a self survey yet.");
      return;
    }
    setModalTargetEmail(classmate.email);
    setModalSelfResponseId(classmate.selfResponseId);
    setFeedbackModalOpen(true);
  };

  const displayName = getWelcomeDisplayName();

  if (!classId) {
    return <div>Please complete your profile to see dashboard data.</div>;
  }
  if (error) {
    console.error("SWR error:", error);
    return <div>Error loading dashboard data.</div>;
  }
  if (isLoading || !data) return <div>Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {displayName}, to Week {weekNumber}: {currentTheme}
      </h1>

      {/* Self vs Peer Averages Chart */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Self vs Peer Averages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(data?.averages || []).map((d: any) => (
            <div key={d.category}>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{d.category}</p>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex">
                <motion.div
                  className="bg-indigo-500"
                  style={{ width: `${(d.selfavg || 0) * 20}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.selfavg || 0) * 20}%` }}
                />
                <motion.div
                  className="bg-green-500"
                  style={{ width: `${(d.peeravg || 0) * 20}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.peeravg || 0) * 20}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-400">
                You: {d.selfavg || 0}/5 | Peers: {d.peeravg || 0}/5
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Classmate Feedback Section */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Classmates to Review
        </h2>
        {data?.classmates?.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All feedback complete or no classmates found.
          </p>
        )}
        <div className="flex flex-col space-y-3">
          {(data?.classmates || []).map((s: any) => {
            const displayStudent = getClassmateFullDisplayInfo(s);
            return (
              <div key={s.email} className="flex justify-between items-center w-full p-4 border rounded bg-gray-100 dark:bg-gray-800 text-sm">
                <p>{displayStudent}</p>
                <button
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium transition ${
                    givenFeedback.includes(s.email)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                  disabled={givenFeedback.includes(s.email)}
                  onClick={() => openFeedbackModal(s)}
                >
                  {givenFeedback.includes(s.email) ? "Feedback Given" : "Give Feedback"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <FeedbackModal
          targetUserEmail={modalTargetEmail}
          targetResponseId={modalSelfResponseId}
          onClose={() => setFeedbackModalOpen(false)}
        />
      )}
    </div>
  );
}
