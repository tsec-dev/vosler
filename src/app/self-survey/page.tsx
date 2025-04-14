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

  useEffect(() => {
    if (!user) return;

    supabase
      .from("surveys")
      .select("id, title, name, created_at")
      .eq("is_self_survey", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching self surveys:", error);
        } else {
          setSurveys(data || []);
          if (data && data.length > 0) {
            setSelectedSurveyId(data[0].id); // auto-select the most recent one
          }
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

  const handleTextAnswer = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer_text: value,
      },
    }));
  };

  const handleMultipleChoice = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer_text: value,
      },
    }));
  };

  const renderQuestionInput = (question: any) => {
    switch (question.question_type) {
      case "scale":
        return (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`cursor-pointer ${responses[question.id]?.rating >= num ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => handleRate(question.id, num)}
              />
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {question.options && Array.isArray(question.options) &&
              question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${question.id}-${index}`}
                    name={`question-${question.id}`}
                    checked={responses[question.id]?.answer_text === option}
                    onChange={() => handleMultipleChoice(question.id, option)}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${question.id}-${index}`}>{option}</label>
                </div>
              ))}
          </div>
        );
      case "text":
        return (
          <textarea
            placeholder="Your answer..."
            value={responses[question.id]?.answer_text || ""}
            onChange={(e) => handleTextAnswer(question.id, e.target.value)}
            rows={3}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        );
      default:
        return (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`cursor-pointer ${responses[question.id]?.rating >= num ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => handleRate(question.id, num)}
              />
            ))}
          </div>
        );
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedSurveyId) return;

    const { data: responseRecord, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: user.emailAddresses[0].emailAddress,
        survey_id: selectedSurveyId,
      })
      .select()
      .single();

    if (error || !responseRecord) {
      console.error("Error inserting survey response:", error);
      alert("❌ Failed to submit survey.");
      return;
    }

    for (const q of questions) {
      const r = responses[q.id];
      if (!r) continue;

      const payload = {
        response_id: responseRecord.id,
        question_id: q.id,
        rating: r.rating ?? null,
        answer_text: r.answer_text ?? (r.comment || null),
      };

      const { error: answerError } = await supabase
        .from("survey_answers")
        .insert(payload);

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
        <h1 className="text-2xl font-bold mb-4">Self Survey</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Select a self‑survey below and complete your personal reflection.
        </p>

        <select
          className="block w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
          <div className="space-y-8 mt-6">
            {questions.map((q) => (
              <div key={q.id} className="border-b pb-4">
                <p className="font-semibold mb-2">{q.prompt || q.question_text}</p>
                {renderQuestionInput(q)}
                {q.question_type === "scale" && (
                  <textarea
                    placeholder="Optional comments..."
                    value={responses[q.id]?.comment || ""}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [q.id]: {
                          ...prev[q.id],
                          comment: e.target.value,
                        },
                      }))
                    }
                    rows={2}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white mt-2"
                  />
                )}
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
