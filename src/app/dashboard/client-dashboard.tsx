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

// Define the quotes array
const inspirationalQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" }
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientDashboard({ user, student }: DashboardProps): JSX.Element {
  const { user: clerkUser, isLoaded } = useUser();
  const [classId, setClassId] = useState<string | null>(null);
  const [quote, setQuote] = useState({ text: "", author: "" });
  
  // Modal state for peer feedback
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [modalTargetEmail, setModalTargetEmail] = useState("");
  const [modalSelfResponseId, setModalSelfResponseId] = useState("");

  // Set a random quote on component mount and every 30 seconds
  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setQuote(inspirationalQuotes[randomIndex]);
    };
    
    getRandomQuote(); // Set initial quote
    const interval = setInterval(getRandomQuote, 30000); // Change quote every 30 seconds
    
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

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

  // SWR fetch for dashboard main data
  const { data, error, isLoading } = useSWR(
    classId ? `/api/dashboard?classId=${classId}&userEmail=${user.email}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  // SWR fetch for approved feedback comments
  const { data: feedback, error: feedbackError, isLoading: feedbackLoading } = useSWR(
    user.email ? `/api/approved-feedback?targetEmail=${user.email}` : null,
    fetcher,
    { refreshInterval: 30000 } // Adjust as needed for real-time updates
  );

  // SWR fetch for announcements
  const { data: announcements, error: announcementsError, isLoading: announcementsLoading } = useSWR(
    classId ? `/api/announcements?classId=${classId}` : null,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
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
      {/* Centered Welcome Message */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {displayName} 👋
        </h1>
        <h2 className="text-xl text-white mt-2">
          Week {weekNumber}: {currentTheme}
        </h2>
        
        {/* Inspirational Quote */}
        {quote.text && (
          <div className="mt-4 p-4 mx-auto max-w-2xl bg-gray-800 rounded-lg border border-gray-700">
            <p className="italic text-gray-300">"{quote.text}"</p>
            <p className="text-right text-gray-400 mt-2">— {quote.author}</p>
          </div>
        )}
      </div>

      {/* Announcements Box */}
      <div className="p-6 border rounded-lg bg-orange-600/30 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Course Announcements
        </h2>
        {announcementsLoading ? (
          <p className="text-white opacity-80">Loading announcements...</p>
        ) : announcementsError ? (
          <p className="text-white opacity-80">Unable to load announcements.</p>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement: any) => (
              <div key={announcement.id} className="p-4 bg-orange-700/80 rounded-lg border border-orange-500">
                <h3 className="font-semibold text-white">{announcement.title}</h3>
                <p className="text-white opacity-90 mt-2">{announcement.content}</p>
                <p className="text-xs text-orange-200 mt-2">
                  Posted: {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white opacity-80">No announcements at this time.</p>
        )}
      </div>

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

      {/* Approved Peer Feedback Section */}
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Your Peer Feedback
        </h2>
        {feedbackLoading ? (
          <p>Loading your feedback comments...</p>
        ) : feedbackError ? (
          <p>Error loading feedback comments.</p>
        ) : feedback && feedback.length > 0 ? (
          feedback.map((comment: any) => (
            <div key={comment.id} className="p-4 mb-4 border rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {comment.category}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{comment.comment_text}</p>
              <div className="text-xs text-gray-500 mt-1">
                Rating: {comment.rating} |{" "}
                Submitted: {new Date(comment.submitted_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No feedback comments available.</p>
        )}
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