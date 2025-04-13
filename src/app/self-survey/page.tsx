"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { FaStar } from "react-icons/fa";

export default function SelfSurveyPage() {
  const { user } = useUser();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load user's class from metadata (set during invite)
    const classIdFromMeta = user?.publicMetadata?.class_id as string;
    setClassId(classIdFromMeta);

    // Load all self surveys - only those explicitly marked as self surveys
    supabase
      .from("surveys")
      .select("id, title, name")
      .eq("is_self_survey", true)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching self surveys:", error);
        } else {
          console.log("Fetched self surveys:", data);
          setSurveys(data || []);
        }
      });
  }, [user]);

  useEffect(() => {
    if (!selectedSurveyId) return;

    supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", selectedSurveyId)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching survey questions:", error);
        } else {
          setQuestions(data || []);
        }
      });
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
    if (!user || !selectedSurveyId) return;

    // Insert survey response
    const { data: responseRecord, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: user.id,
        survey_id: selectedSurveyId,
        // If your table requires additional columns (like submitted_at), ensure they have default values or include them here.
      })
      .select()
      .single();

    if (error || !responseRecord) {
      console.error("Error inserting survey response:", error);
      alert("❌ Failed to submit survey. Check the console for error details.");
      return;
    }

    // Insert answers for each question
    for (const q of questions) {
      const r = responses[q.id];
      if (!r) continue;

      const { error: answerError } = await supabase.from("survey_answers").insert({
        response_id: responseRecord.id,
        question_id: q.id,
        rating: r.rating ?? null,
        comment: r.comment ?? null,
      });
      if (answerError) {
        console.error(`Error inserting answer for question ${q.id}:`, answerError);
      }
    }

    alert("✅ Self survey submitted!");
    setSelectedSurveyId(null);
    setQuestions([]);
    setResponses({});
  };

  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🧠 Self Survey</h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Select a self-survey below and complete your personal reflection.
        </p>

        <select
          className="mb-6 p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={selectedSurveyId || ""}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
        >
          <option value="" disabled>
            Select a self survey...
          </option>
          {surveys.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title || s.name}
            </option>
          ))}
        </select>

        {questions.length > 0 && (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id}>
                <p className="font-semibold mb-2">{q.prompt || q.question_text}</p>

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
                  placeholder="Optional comments..."
                  value={responses[q.id]?.comment || ""}
                  onChange={(e) => handleComment(q.id, e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-medium mt-4"
            >
              Submit Self Survey
            </button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
