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

    // Load user's class from metadata (set during invite or similar)
    // (You can remove this if self surveys don’t need a class id.)
    // const classIdFromMeta = user?.publicMetadata?.class_id as string;
    // setClassId(classIdFromMeta);

    // Load all self surveys – only those marked explicitly as self surveys
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

  // Handler for star rating inputs (for scale questions)
  const handleRate = (questionId: string, value: number) => {
    console.log(`Setting rating for question ${questionId}:`, value);
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        rating: value,
      },
    }));
  };

  // Handler for free text answers (if the question type is "text")
  const handleTextAnswer = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer_text: value,
      },
    }));
  };

  // Handler for multiple choice (radio) if needed in the future
  const handleMultipleChoice = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer_text: value,
      },
    }));
  };

  // Render the question input based on its type.
  // For now, self surveys have been set up for scale (star ratings) and free text.
  // But if a question happens to be "radio", this code will render radio inputs.
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
        // Fallback to a star rating view if no known type is specified.
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

    // Insert the survey response (adjust as needed if self surveys require additional fields)
    const { data: responseRecord, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: user.id,
        survey_id: selectedSurveyId,
      })
      .select()
      .single();

    if (error || !responseRecord) {
      console.error("Error inserting survey response:", error);
      alert("❌ Failed to submit survey. Check the console for error details.");
      return;
    }

    // Loop through each question and insert an answer record.
    for (const q of questions) {
      const r = responses[q.id];
      if (!r) {
        console.warn(`No response found for question ${q.id}`);
        continue;
      }

      // For scale questions, use r.rating; for text questions, use r.answer_text.
      // (For self surveys we also allow an optional comment.)
      const payload = {
        response_id: responseRecord.id,
        question_id: q.id,
        rating: r.rating ?? null,
        answer_text: r.answer_text ?? (r.comment ? r.comment : null),
      };

      const { error: answerError } = await supabase
        .from("survey_answers")
        .insert(payload);

      if (answerError) {
        console.error(`Error inserting answer for question ${q.id}:`, answerError);
      } else {
        console.log(`Inserted answer for question ${q.id}`, payload);
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
          className="block w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                {/* Render the main input based on question type */}
                {renderQuestionInput(q)}
                {/* If this is a scale (star rating) question, provide an optional comment box */}
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
