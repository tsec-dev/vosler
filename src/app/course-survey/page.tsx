"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";

// Simple star rating component
function StarRating({ value = 0, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={`cursor-pointer text-2xl ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CourseSurveyPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
      if (error) console.error("Failed to load surveys", error);
      else setSurveys(data);
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (!selectedSurvey) return;

    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", selectedSurvey.id)
        .order("position", { ascending: true });

      if (error) console.error("Failed to load questions", error);
      else setQuestions(data);
    };
    fetchQuestions();
  }, [selectedSurvey]);

  const handleChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSurvey) return;

    const missingRequired = questions.some(
      (q) => q.required && (responses[q.id] === undefined || responses[q.id] === "")
    );
    if (missingRequired) {
      alert("❗ Please fill out all required questions before submitting.");
      return;
    }

    setSubmitting(true);

    const { data: responseData, error: responseError } = await supabase
      .from("survey_responses")
      .insert({ survey_id: selectedSurvey.id })
      .select()
      .single();

    if (responseError) {
      console.error("Response insert failed", responseError);
      alert("Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    const answers = questions.map((q) => ({
      response_id: responseData.id,
      question_id: q.id,
      answer_text: String(responses[q.id] ?? ""),
    }));

    const { error: answersError } = await supabase.from("survey_answers").insert(answers);

    if (answersError) {
      console.error("Answer insert failed", answersError);
      alert("Some answers failed to save.");
    } else {
      alert("✅ Survey submitted successfully!");
      setSelectedSurvey(null);
      setQuestions([]);
      setResponses({});
    }

    setSubmitting(false);
  };

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📋 Course Survey</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Please select a survey and share your feedback. Your input helps us improve future sessions.
        </p>

        {/* Survey Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select a Survey</label>
          <select
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
            onChange={(e) => {
              const survey = surveys.find((s) => s.id === e.target.value);
              setSelectedSurvey(survey || null);
              setResponses({});
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select one...
            </option>
            {surveys.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Questions */}
        {selectedSurvey && questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow space-y-4"
              >
                <label className="block text-sm font-semibold">
                  {q.question_text} {q.required ? "*" : ""}
                </label>

                {q.question_type === "text" && (
                  <textarea
                    rows={3}
                    value={responses[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
                    placeholder="Your answer..."
                  />
                )}

                {q.question_type === "number" && (
                  <input
                    type="number"
                    value={responses[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-24 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-1 text-sm"
                  />
                )}

                {q.question_type === "boolean" && (
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.id}
                        value="true"
                        checked={responses[q.id] === "true"}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.id}
                        value="false"
                        checked={responses[q.id] === "false"}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                      No
                    </label>
                  </div>
                )}
                
                {q.question_type === "multiple" && q.options && (
                <div className="flex flex-col gap-2">
                  {q.options.split(",").map((opt: string) => (
                    <label key={opt.trim()} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.trim()}
                        checked={responses[q.id] === opt.trim()}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                      {opt.trim()}
                    </label>
                  ))}
                </div>
              )}

                {q.question_type === "scale" && (
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={responses[q.id] || "3"}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full"
                  />
                )}

                {q.question_type === "stars" && (
                  <StarRating
                    value={Number(responses[q.id] || 0)}
                    onChange={(val) => handleChange(q.id, val)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        {selectedSurvey && questions.length > 0 && (
          <div className="mt-10">
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded-md text-sm transition"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
