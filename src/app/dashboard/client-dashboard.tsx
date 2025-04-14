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
  military_name?: string;
  rank?: string;
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps;
}

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
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [modalTargetEmail, setModalTargetEmail] = useState("");
  const [modalSelfResponseId, setModalSelfResponseId] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  const { data, error, isLoading, mutate } = useSWR(
    classId ? `/api/dashboard?classId=${classId}&userEmail=${user.email}` : null,
    fetcher
  );

  const { data: feedback, isLoading: feedbackLoading } = useSWR(
    user.email ? `/api/approved-feedback?targetEmail=${user.email}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const { data: announcements } = useSWR(
    classId ? `/api/announcements?classId=${classId}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setQuote(inspirationalQuotes[randomIndex]);
    };
    getRandomQuote();
    const interval = setInterval(getRandomQuote, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      const meta = clerkUser.publicMetadata as { class_id?: string };
      setClassId(meta.class_id || null);
    }
  }, [isLoaded, clerkUser]);

  useEffect(() => {
    if (announcements && announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [announcements]);

  const openFeedbackModal = (classmate: any) => {
    setModalTargetEmail(classmate.email);
    setModalSelfResponseId(classmate.selfResponseId);
    setFeedbackModalOpen(true);
  };

  const getDisplayName = () => {
    if (student.rank && student.first_name && student.last_name) {
      return `${student.rank} ${student.first_name} ${student.last_name}`;
    }
    return student.first_name || user.email;
  };

  const givenFeedback = (data?.feedback || []).map((r: any) => r.target_id);

  return (
    <>
      {announcements?.length > 0 && (
        <div className="w-full bg-orange-600/30 py-2 rounded-lg">
          <div className="mx-auto flex items-center">
            <div className="font-bold text-white ml-4 mr-3">ANNOUNCEMENT:</div>
            <div className="text-white flex-1 overflow-hidden">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-semibold">{announcements[currentAnnouncement].title}:</span>{" "}
                {announcements[currentAnnouncement].content}
              </div>
            </div>
            {announcements.length > 1 && (
              <div className="text-xs text-white opacity-80 mr-4">
                {currentAnnouncement + 1}/{announcements.length}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome, {getDisplayName()} 👋</h1>
          <h2 className="text-xl text-white mt-2">
            Week {data?.weekNumber || 1}: {data?.currentTheme || "Growth"}
          </h2>
          {quote.text && (
            <div className="mt-4 p-3 mx-auto max-w-2xl bg-gray-800/40 rounded-lg">
              <p className="italic text-gray-200">"{quote.text}"</p>
              <p className="text-right text-gray-400 mt-1 text-sm">— {quote.author}</p>
            </div>
          )}
        </div>

        {/* Feedback Chart */}
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

        {/* Feedback Comments */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Peer Feedback</h2>
          {feedbackLoading ? (
            <p>Loading your feedback comments...</p>
          ) : feedback?.length > 0 ? (
            feedback.map((comment: any) => (
              <div key={comment.id} className="p-4 mb-4 border rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{comment.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{comment.comment_text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No feedback comments available.</p>
          )}
        </div>

        {/* Classmates To Review */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Classmates to Review
          </h2>
          <div className="flex flex-col space-y-3">
            {(data?.classmates || []).map((s: any) => (
              <div key={s.email} className="flex justify-between items-center p-4 border rounded bg-gray-100 dark:bg-gray-800 text-sm">
                <p>{s.rank} {s.first_name} {s.last_name}</p>
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
            ))}
          </div>
        </div>

        {feedbackModalOpen && (
          <FeedbackModal
            targetUserEmail={modalTargetEmail}
            targetResponseId={modalSelfResponseId}
            classId={classId!}
            onClose={() => setFeedbackModalOpen(false)}
            onFeedbackSubmitted={() => {
              setFeedbackModalOpen(false);
              mutate(); // Re-fetch SWR dashboard data after submission
            }}
          />
        )}
      </div>
    </>
  );
}
