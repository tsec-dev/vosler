"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

interface FeedbackModalProps {
  targetUserEmail: string;
  targetResponseId: string;
  onClose: () => void;
  // If you have a class_id column, keep it; otherwise remove it
  classId?: string;
  onFeedbackSubmitted?: () => void;
}

interface Question {
  id: string;
  question_text: string;
  category: string | null;
  question_type: string;
}

export default function FeedbackModal({
  targetUserEmail,
  targetResponseId,
  onClose,
  classId,
  onFeedbackSubmitted,
}: FeedbackModalProps) {
  const { user } = useUser();

  // Grab the email address from Clerk:
  const peerEmail = user?.primaryEmailAddress?.emailAddress || "";

  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load the most recent peer survey
  useEffect(() => {
    const loadPeerSurvey = async () => {
      const { data: surveys, error } = await supabase
        .from("surveys")
        .select("id, name, is_peer_survey")
        .eq("is_peer_survey", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading peer surveys:", error);
        return;
      }

      const mostRecentPeerSurvey = surveys?.[0];
      if (mostRecentPeerSurvey) {
        setSurveyId(mostRecentPeerSurvey.id);
      } else {
        console.warn("No peer survey found.");
      }
    };

    loadPeerSurvey();
  }, []);

  // Load questions from that peer survey
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

    setIsSubmitting(true);
    setError("");

    try {
      // Insert into the "feedback" table
      // Make sure "submitted_by" is the same field the foreign key expects 
      // and that it matches a row in your "users" table (users.email).
      const feedbackPayload = {
        submitted_by: peerEmail,  // <<--- Must match users.email row
        target_id: targetUserEmail,
        target_response_id: targetResponseId,
        ratings,
        comments: comment,
        target_type: "peer",
        approved: false
        // Add this only if you have columns for them:
        // class_id,
        // user_id (if needed and if your feedback table has a user_id column)
      };

      const { error: feedbackError } = await supabase
        .from("feedback")
        .insert(feedbackPayload);

      if (feedbackError) {
        throw new Error(`Feedback error: ${feedbackError.message}`);
      }

      // Optionally insert a separate comment record
      if (comment.trim()) {
        const commentPayload = {
          target_user_id: targetUserEmail,
          comment_text: comment,
          approved: false,
          submitted_by: peerEmail,
          // "category" is optional or based on your schema
          category: Object.keys(ratings)[0] || "General",
          // class_id (again, only if your table actually has it)
        };

        const { error: commentError } = await supabase
          .from("survey_comments")
          .insert(commentPayload);

        if (commentError) {
          console.error("Comment error:", commentError);
        }
      }

      alert("Feedback submitted successfully!");
      onClose();
      onFeedbackSubmitted?.();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Feedback for {targetUserEmail}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

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
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
