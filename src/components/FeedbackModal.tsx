"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

interface FeedbackModalProps {
  targetUserEmail: string;
  targetResponseId: string;
  onClose: () => void;
  classId: string;
}

interface Question {
  id: string;
  question_text: string;
  category: string | null;
  question_type: string;
}

export default function FeedbackModal({ targetUserEmail, targetResponseId, onClose, classId }: FeedbackModalProps) {
  const { user } = useUser();
  const peerId = user?.id || "";

  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  // Load peer survey for this class
  useEffect(() => {
    const loadPeerSurvey = async () => {
      const { data: surveys, error } = await supabase
        .from("surveys")
        .select("id, name")
        .eq("is_peer_survey", true)
        .like("name", `%${classId}%`) // Optional: match class identifier in the name if needed
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading peer surveys:", error);
        return;
      }

      const peerSurvey = surveys?.find((s) => s.name.includes("(Peer)"));
      if (peerSurvey) {
        setSurveyId(peerSurvey.id);
      }
    };

    loadPeerSurvey();
  }, [classId]);

  // Load questions for selected survey
  useEffect(() => {
    if (!surveyId) return;

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("survey_questions")
        .select("id, question_text, category, question_type")
        .eq("survey_id", surveyId);

      if (error) {
        console.error("Error loading questions:", error);
        return;
      }

      setQuestions(data || []);
    };

    loadQuestions();
  }, [surveyId]);

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(ratings).every((r) => r === 0)) {
      alert("Please rate at least one question.");
      return;
    }

    const payload = {
      submitted_by: peerId,
      target_id: targetUserEmail,
      target_response_id: targetResponseId,
      ratings,
      comments: comment,
      target_type: "peer"
    };

    const { error } = await supabase.from("feedback").insert(payload);
    if (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } else {
      alert("Feedback submitted successfully!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Feedback for {targetUserEmail}</h2>

        {questions.length === 0 && (
          <p className="text-sm text-gray-400">Loading survey questions...</p>
        )}

        {questions.map((q) => {
          const key = q.category || q.question_text;
          return (
            <div key={q.id} className="mb-4">
              <p className="mb-2 font-semibold">{key}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <FaStar
                    key={num}
                    onClick={() => handleRatingChange(key, num)}
                    className={`cursor-pointer ${
                      (ratings[key] || 0) >= num ? "text-yellow-400" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Additional comments (optional)"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-400 hover:bg-gray-300 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
