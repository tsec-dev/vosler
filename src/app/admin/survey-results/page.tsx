"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BaseLayout from "@/components/BaseLayout";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  required: boolean;
  position: number;
}

interface Answer {
  question_id: string;
  rating?: number | string;
  answer_text?: string;
}

export default function SurveyResultsPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [responseCount, setResponseCount] = useState<number>(0);

  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Failed to load surveys", error);
      else setSurveys(data || []);
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (!selectedSurvey) return;

    const fetchData = async () => {
      const { data: responseRows, error: responseError } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("survey_id", selectedSurvey.id);

      if (responseError) {
        console.error("Failed to load responses", responseError);
        return;
      }

      const responseIds = responseRows.map((r) => r.id);
      setResponseCount(responseIds.length);

      const { data: answerRows, error: answerError } = await supabase
        .from("survey_answers")
        .select("*")
        .in("response_id", responseIds);

      if (answerError) console.error("Failed to load answers", answerError);
      setAnswers(answerRows || []);

      const { data: questionRows, error: questionError } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", selectedSurvey.id)
        .order("position", { ascending: true });

      if (questionError) console.error("Failed to load questions", questionError);
      setQuestions(questionRows || []);
    };

    fetchData();
  }, [selectedSurvey]);

  // Modified helper: use rating if available; otherwise, fall back to answer_text.
  const getAnswersFor = (questionId: string) =>
    answers
      .filter((a) => a.question_id === questionId)
      .map((a) => (a.rating != null ? a.rating : a.answer_text));

  // Updated getAverage that checks type before parsing
  const getAverage = (questionId: string) => {
    const relevant = getAnswersFor(questionId)
      .map((a) => (typeof a === "number" ? a : parseFloat(a as string)))
      .filter((n) => !isNaN(n));
    if (!relevant.length) return null;
    const sum = relevant.reduce((a, b) => a + b, 0);
    return (sum / relevant.length).toFixed(2);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">📈 Survey Results Viewer</h1>

        {/* Survey Dropdown */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select a Survey</label>
          <select
            onChange={(e) => {
              const selected = surveys.find((s) => s.id === e.target.value);
              setSelectedSurvey(selected || null);
              setAnswers([]);
              setQuestions([]);
              setResponseCount(0);
            }}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>
              Select a survey...
            </option>
            {surveys.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSurvey && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {responseCount} response{submissionSuffix(responseCount)} submitted
            </p>

            {questions.map((q) => (
              <div
                key={q.id}
                className="mb-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              >
                <h2 className="text-md font-semibold mb-2">{q.question_text}</h2>

                {["number", "scale", "stars"].includes(q.question_type) ? (
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Average: {getAverage(q.id) ?? "N/A"}
                  </p>
                ) : (
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {getAnswersFor(q.id).map((answer, i) => (
                      <li key={i}>{answer}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </BaseLayout>
  );
}

function submissionSuffix(count: number) {
  return count === 1 ? "" : "s";
}
