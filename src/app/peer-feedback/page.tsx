"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { FaStar } from "react-icons/fa";

export default function PeerFeedbackPage() {
  const { user } = useUser();
  const [classmates, setClassmates] = useState<any[]>([]);
  const [peerSurveys, setPeerSurveys] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const classIdFromMeta = user?.publicMetadata?.class_id as string;
    setClassId(classIdFromMeta);

    // Load classmates
    supabase
      .from("class_students")
      .select("email")
      .eq("class_id", classIdFromMeta)
      .then(({ data }) => {
        const others = (data || []).filter((s) => s.email !== user.emailAddresses[0].emailAddress);
        setClassmates(others);
      });

    // Load peer surveys
    supabase
      .from("surveys")
      .select("id, title")
      .eq("is_peer_survey", true)
      .then(({ data }) => setPeerSurveys(data || []));
  }, [user]);

  useEffect(() => {
    if (!selectedSurveyId) return;

    supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", selectedSurveyId)
      .then(({ data }) => setQuestions(data || []));
  }, [selectedSurveyId]);

  const handleRate = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        rating: value,
      },
    }));
  };

  const handleComment = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        comment: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!user || !classId || !selectedSurveyId || !selectedTargetId) return;

    const { data: responseRecord, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: user.id,
        target_user_id: selectedTargetId,
        response_type: "peer",
        class_id: classId,
        survey_id: selectedSurveyId,
      })
      .select()
      .single();

    if (error || !responseRecord) {
      alert("❌ Failed to submit peer feedback.");
      console.error(error);
      return;
    }

    // Save answers and comments
    for (const q of questions) {
      const r = responses[q.id];
      if (!r) continue;

      await supabase.from("survey_answers").insert({
        response_id: responseRecord.id,
        question_id: q.id,
        rating: r.rating ?? null,
      });

      if (r.comment?.length) {
        await supabase.from("survey_comments").insert({
          response_id: responseRecord.id,
          question_id: q.id,
          comment_text: r.comment,
          target_user_id: selectedTargetId,
          class_id: classId,
          approved: false,
          category: q.category || q.prompt || "Uncategorized"
        });
      }
    }

    alert("✅ Peer feedback submitted!");
    setSelectedTargetId(null);
    setSelectedSurveyId(null);
    setQuestions([]);
    setResponses({});
  };

  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Peer Feedback</h1>

        <div className="space-y-4 mb-8">
          <select
            value={selectedTargetId || ""}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="" disabled>Select a classmate...</option>
            {classmates.map((s) => (
              <option key={s.email} value={s.email}>{s.email}</option>
            ))}
          </select>

          <select
            value={selectedSurveyId || ""}
            onChange={(e) => setSelectedSurveyId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="" disabled>Select a peer survey...</option>
            {peerSurveys.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {questions.length > 0 && (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id}>
                <p className="font-semibold mb-2">{q.prompt}</p>

                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FaStar
                      key={num}
                      className={`cursor-pointer ${
                        responses[q.id]?.rating >= num ? "text-yellow-400" : "text-gray-400"
                      }`}
                      onClick={() => handleRate(q.id, num)}
                    />
                  ))}
                </div>

                <textarea
                  placeholder="Optional comment for this question..."
                  value={responses[q.id]?.comment || ""}
                  onChange={(e) => handleComment(q.id, e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded font-medium mt-4"
            >
              Submit Peer Feedback
            </button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
