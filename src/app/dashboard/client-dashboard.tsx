"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import FeedbackModal from "@/components/FeedbackModal";

interface Classmate {
  id: string;
  email: string;
  military_name?: string;
  first_name?: string;
  last_name?: string;
  selfResponseId: string | null;
}

interface Props {
  classId: string;
  userEmail: string;
}

interface AverageRating {
  category: string;
  self: number;
  peer: number;
}

export default function ClientDashboard({ classId, userEmail }: Props) {
  const [averages, setAverages] = useState<AverageRating[]>([]);
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [submittedFeedback, setSubmittedFeedback] = useState<string[]>([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [modalTargetEmail, setModalTargetEmail] = useState("");
  const [modalSelfResponseId, setModalSelfResponseId] = useState("");

  const fetchDashboardData = async () => {
    const res = await fetch(`/api/dashboard?classId=${classId}&userEmail=${userEmail}`);
    const json = await res.json();

    setAverages(json.averages || []);
    setClassmates(json.classmates || []);
    setSubmittedFeedback((json.feedback || []).map((f: any) => f.target_id));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [classId, userEmail]);

  const openModal = (targetEmail: string, responseId: string) => {
    setModalTargetEmail(targetEmail);
    setModalSelfResponseId(responseId);
    setFeedbackModalOpen(true);
  };

  const closeModal = () => {
    setFeedbackModalOpen(false);
  };

  const availableClassmates = classmates.filter(
    (c) => c.selfResponseId && !submittedFeedback.includes(c.email)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white">Weekly Reflection Summary</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg text-white mb-2">Your Self Ratings</h3>
          {averages.map((item) => (
            <div key={item.category} className="mb-2">
              <p className="text-sm text-white mb-1">{item.category}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    className={item.self >= n ? "text-yellow-400" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg text-white mb-2">Peer Ratings</h3>
          {averages.map((item) => (
            <div key={item.category} className="mb-2">
              <p className="text-sm text-white mb-1">{item.category}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    className={item.peer >= n ? "text-yellow-400" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Give Peer Feedback</h3>
        {availableClassmates.length === 0 ? (
          <p className="text-gray-400">✅ You’ve submitted feedback for all classmates.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {availableClassmates.map((c) => (
              <div
                key={c.id}
                className="p-4 border border-gray-700 rounded-md bg-gray-800 shadow"
              >
                <p className="text-white font-medium mb-2">
                  {c.military_name || `${c.first_name} ${c.last_name}`}
                </p>
                <button
                  onClick={() => openModal(c.email, c.selfResponseId!)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
                >
                  Give Feedback
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <FeedbackModal
          targetUserEmail={modalTargetEmail}
          targetResponseId={modalSelfResponseId}
          onClose={closeModal}
          classId={classId}
          onFeedbackSubmitted={() => {
            closeModal();
            fetchDashboardData(); // Auto-refresh list + data after submission
          }}
        />
      )}
    </div>
  );
}
