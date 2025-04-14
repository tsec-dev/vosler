"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import FeedbackModal from "@/components/FeedbackModal";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  user: {
    email: string;
    id: string;
    isAdmin?: boolean;
  };
  student: {
    first_name: string;
    class_id: string;
  };
}

interface Peer {
  email: string;
  military_name: string;
  rank: string;
  selfResponseId: string | null;
}

interface Feedback {
  target_id: string;
}

export default function ClientDashboard({ user, student }: Props) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [givenFeedback, setGivenFeedback] = useState<Feedback[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadPeerData = async () => {
    if (!student.class_id || !user.email) return;

    const { data: students } = await supabase
      .from("student_profiles")
      .select("email, military_name, rank")
      .eq("class_id", student.class_id)
      .neq("email", user.email);

    const { data: responses } = await supabase
      .from("survey_responses")
      .select("user_id, id")
      .in("user_id", students?.map((s) => s.email) || []);

    const enrichedPeers =
      students?.map((s) => ({
        ...s,
        selfResponseId:
          responses?.find((r) => r.user_id === s.email)?.id || null,
      })) || [];

    setPeers(enrichedPeers);

    const { data: feedbackGiven } = await supabase
      .from("feedback")
      .select("target_id")
      .eq("submitted_by", user.email)
      .eq("target_type", "peer");

    setGivenFeedback(feedbackGiven || []);
  };

  useEffect(() => {
    loadPeerData();
  }, [student.class_id, user.email]);

  const hasGivenFeedback = (email: string) =>
    givenFeedback.some((f) => f.target_id === email);

  const openFeedbackModal = (peer: Peer) => {
    setSelectedPeer(peer);
    setModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setModalOpen(false);
    setSelectedPeer(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {student.first_name}!</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Give Peer Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click a peer below to leave feedback.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {peers
            .filter((p) => p.selfResponseId && !hasGivenFeedback(p.email))
            .map((peer) => (
              <div
                key={peer.email}
                className="p-4 border rounded bg-white dark:bg-gray-800 shadow"
              >
                <p className="font-medium">
                  {peer.rank} {peer.military_name}
                </p>
                <button
                  onClick={() => openFeedbackModal(peer)}
                  className="mt-2 text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Give Feedback
                </button>
              </div>
            ))}
          {peers.filter((p) => p.selfResponseId && !hasGivenFeedback(p.email)).length === 0 && (
            <p className="text-sm text-gray-400 col-span-2">
              🎉 You've submitted all peer feedback!
            </p>
          )}
        </div>
      </section>

      {modalOpen && selectedPeer && selectedPeer.selfResponseId && (
        <FeedbackModal
          targetUserEmail={selectedPeer.email}
          targetResponseId={selectedPeer.selfResponseId}
          classId={student.class_id}
          onClose={closeFeedbackModal}
          onFeedbackSubmitted={() => {
            closeFeedbackModal();
            loadPeerData(); // ✅ auto-refresh
          }}
        />
      )}
    </div>
  );
}
