"use client";

import { useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";

export default function SurveyPage() {
  const [title, setTitle] = useState("");
  // Added `options` field to each question.
  const [questions, setQuestions] = useState([
    { prompt: "", category: "", type: "stars", options: [] as string[] }
  ]);
  const [surveyType, setSurveyType] = useState<"course" | "self" | "paired">("course");

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { prompt: "", category: "", type: "stars", options: [] as string[] }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update question value; when type changes ensure options are set appropriately.
  const handleChange = (
    index: number,
    field: "prompt" | "category" | "type",
    value: string
  ) => {
    const updated = [...questions];
    if (field === "type") {
      updated[index][field] = value;
      if (value === "radio" && !updated[index].options) {
        updated[index].options = [];
      } else if (value !== "radio") {
        // Optionally, clear out options for non-radio questions.
        updated[index].options = [];
      }
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  // Handlers for radio options
  const handleAddOption = (questionIndex: number) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options.push("");
    setQuestions(updated);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const handleChangeOption = (questionIndex: number, optionIndex: number, newValue: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = newValue;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }

    let surveyPayloads;

    if (surveyType === "paired") {
      surveyPayloads = [
        { title: `${title} (Self)`, is_self_survey: true, is_peer_survey: false },
        { title: `${title} (Peer)`, is_self_survey: false, is_peer_survey: true }
      ];
    } else if (surveyType === "self") {
      surveyPayloads = [{ title, is_self_survey: true, is_peer_survey: false }];
    } else {
      surveyPayloads = [{ title, is_self_survey: false, is_peer_survey: false }];
    }

    for (const payload of surveyPayloads) {
      const { data: survey, error } = await supabase
        .from("surveys")
        .insert(payload)
        .select()
        .single();

      if (error || !survey) {
        alert("Failed to create survey.");
        console.error(error);
        return;
      }

      // Build the question inserts; include options if the question type is radio.
      const questionInserts = questions.map((q) => ({
        survey_id: survey.id,
        prompt: q.prompt,
        category: q.type !== "radio" ? (q.category || "General") : null,
        type: q.type,
        options: q.type === "radio" ? q.options : null
      }));

      const { error: qError } = await supabase.from("survey_questions").insert(questionInserts);

      if (qError) {
        alert("Failed to insert questions.");
        console.error(qError);
        return;
      }
    }

    alert("✅ Survey(s) created successfully!");
    setTitle("");
    setQuestions([{ prompt: "", category: "", type: "stars", options: [] }]);
    setSurveyType("course");
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-white">📝 Create New Survey</h2>

        <input
          type="text"
          placeholder="Survey Title"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-sm font-medium mt-4 mb-1 text-white">Survey Type</label>
        <select
          value={surveyType}
          onChange={(e) => setSurveyType(e.target.value as "course" | "self" | "paired")}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white bg-white"
        >
          <option value="course">📋 Course Survey</option>
          <option value="self">🧠 Self Reflection</option>
          <option value="paired">👥 Paired (Self + Peer)</option>
        </select>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="p-4 border rounded bg-gradient-to-br from-gray-800 to-gray-900 dark:border-gray-700 text-white shadow space-y-3"
            >
              <input
                type="text"
                placeholder="Question Prompt"
                className="w-full p-2 border rounded bg-gray-800 text-white"
                value={q.prompt}
                onChange={(e) => handleChange(index, "prompt", e.target.value)}
              />
              {/* Only show category input if the question type is NOT radio */}
              {q.type !== "radio" && (
                <input
                  type="text"
                  placeholder="Category (e.g. Communication)"
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  value={q.category}
                  onChange={(e) => handleChange(index, "category", e.target.value)}
                />
              )}
              <select
                className="w-full p-2 border rounded bg-gray-800 text-white"
                value={q.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
              >
                <option value="stars">⭐ 1–5 Star Rating</option>
                <option value="radio">🔘 Multiple Choice (Radio)</option>
                <option value="text">✍️ Short Text</option>
              </select>
              {/* If type is radio, display options controls */}
              {q.type === "radio" && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Options:</p>
                  {q.options &&
                    q.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          className="w-full p-2 border rounded bg-gray-800 text-white"
                          value={option}
                          onChange={(e) =>
                            handleChangeOption(index, optIndex, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleRemoveOption(index, optIndex)}
                          className="text-red-500 text-sm"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={() => handleAddOption(index)}
                    className="text-blue-400 text-sm hover:underline"
                  >
                    ➕ Add Option
                  </button>
                </div>
              )}
              <button
                className="text-red-500 text-sm mt-1"
                onClick={() => handleRemoveQuestion(index)}
              >
                ❌ Remove Question
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="text-sm text-blue-400 hover:underline"
        >
          ➕ Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded"
        >
          Save Survey
        </button>
      </div>
    </BaseLayout>
  );
}
