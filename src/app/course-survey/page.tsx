"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { FaStar } from "react-icons/fa";

export default function CourseSurveyPage() {
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

    // Load only course surveys
    supabase
      .from("surveys")
      .select("id, title, name")
      .eq("is_course_survey", true)
      .then(({ data }) => {
        console.log("Fetched course surveys:", data);
        setSurveys(data || []);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedSurveyId) return;

    supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", selectedSurveyId)
      .then(({ data }) => setQuestions(data || []));
  }, [selectedSurveyId]);

  const handleRating = (questionId: string, value: number) => {
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

  const handleSubmit = async () => {
    if (!user || !classId || !selectedSurveyId) {
      alert("Missing required information. Please try again.");
      return;
    }

    // Check if all required questions are answered
    const unansweredQuestions = questions.filter(q => {
      const response = responses[q.id];
      return !response || 
        (q.question_type === 'scale' && response.rating === undefined) ||
        (q.question_type === 'text' && !response.answer_text);
    });

    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Create survey response record
    const { data: responseRecord, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: user.id,
        response_type: "course",
        class_id: classId,
        survey_id: selectedSurveyId,
      })
      .select()
      .single();

    if (error || !responseRecord) {
      alert("❌ Failed to submit survey.");
      console.error(error);
      return;
    }

    // Insert answers for each question
    const answersToInsert = [];
    for (const q of questions) {
      const r = responses[q.id];
      if (!r) continue;

      answersToInsert.push({
        response_id: responseRecord.id,
        question_id: q.id,
        rating: r.rating ?? null,
        answer_text: r.answer_text ?? null,
      });
    }

    const { error: answersError } = await supabase
      .from("survey_answers")
      .insert(answersToInsert);

    if (answersError) {
      alert("❌ Failed to save your answers.");
      console.error(answersError);
      return;
    }

    alert("✅ Course survey submitted successfully!");
    setSelectedSurveyId(null);
    setQuestions([]);
    setResponses({});
  };

  // Render different question types
  const renderQuestionInput = (question: any) => {
    switch (question.question_type) {
      case 'scale':
        return (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`cursor-pointer ${
                  responses[question.id]?.rating >= num ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => handleRating(question.id, num)}
              />
            ))}
          </div>
        );
      
      case 'text':
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
        // For multiple choice or other types stored as text
        if (question.options && Array.isArray(question.options)) {
          return (
            <div className="space-y-2">
              {question.options.map((option: string, index: number) => (
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
        } else {
          return (
            <textarea
              placeholder="Your answer..."
              value={responses[question.id]?.answer_text || ""}
              onChange={(e) => handleTextAnswer(question.id, e.target.value)}
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          );
        }
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">📋 Course Survey</h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Please complete this survey about your course experience.
        </p>

        <select
          className="mb-6 p-2 border rounded dark:bg-gray-800 dark:text-white w-full"
          value={selectedSurveyId || ""}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
        >
          <option value="" disabled>Select a course survey...</option>
          {surveys.map((s) => (
            <option key={s.id} value={s.id}>{s.title || s.name}</option>
          ))}
        </select>

        {questions.length > 0 && (
          <div className="space-y-8 mt-4">
            {questions.map((q) => (
              <div key={q.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
                <p className="font-semibold mb-2">{q.prompt || q.question_text}</p>
                {q.category && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Category: {q.category}
                  </p>
                )}
                
                {renderQuestionInput(q)}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium mt-4"
            >
              Submit Course Survey
            </button>
          </div>
        )}

        {selectedSurveyId && questions.length === 0 && (
          <div className="text-center py-8">
            <p>Loading survey questions...</p>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}