// src/components/FeedbackModal.tsx
"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

interface FeedbackModalProps {
  targetUserEmail: string;   // The email of the student receiving feedback
  targetResponseId: string;  // Self survey response ID for that student
  onClose: () => void;
}

export default function FeedbackModal({ targetUserEmail, targetResponseId, onClose }: FeedbackModalProps) {
  const { user } = useUser();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  // Use the unique id from the Clerk user, which should match students.id.
  const peerId = user?.id || "";

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    // Build the payload for peer feedback with ratings as an object.
    const payload = {
      submitted_by: peerId,               // Using the student's unique id instead of email
      target_id: targetUserEmail,         // Recipient's email remains as defined
      target_response_id: targetResponseId,
      ratings: { score: rating },         // Now ratings is a JSON object
      comments: comment,
      target_type: "peer"
    };

    const { error } = await supabase.from("feedback").insert(payload);
    if (error) {
      console.error("Error submitting peer feedback:", error);
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
        <div className="mb-4">
          <p className="mb-2 font-semibold">Star Rating:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(num => (
              <FaStar
                key={num}
                onClick={() => setRating(num)}
                className={`cursor-pointer ${rating >= num ? 'text-yellow-400' : 'text-gray-400'}`}
              />
            ))}
          </div>
        </div>
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
