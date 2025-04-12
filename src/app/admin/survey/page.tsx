"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SurveyEditor() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ prompt: "", category: "" }]);
  const [surveyType, setSurveyType] = useState<"course" | "self" | "paired">("course");

  const handleAddQuestion = () => {
    setQuestions([...questions, { prompt: "", category: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: "prompt" | "category", value: string) => {
    const updated = [...questions];
    updated[index][field] = value;
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

      const questionInserts = questions.map((q) => ({
        survey_id: survey.id,
        prompt: q.prompt,
        category: q.category || "General",
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
    setQuestions([{ prompt: "", category: "" }]);
    setSurveyType("course");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📝 Create New Survey</h2>

      <input
        type="text"
        placeholder="Survey Title"
        className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block text-sm font-medium mt-4 mb-1 dark:text-white">Survey Type</label>
      <select
        value={surveyType}
        onChange={(e) => setSurveyType(e.target.value as "course" | "self" | "paired")}
        className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
      >
        <option value="course">📋 Course Survey</option>
        <option value="self">🧠 Self Reflection</option>
        <option value="paired">👥 Paired (Self + Peer)</option>
      </select>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="p-4 border rounded space-y-2 bg-white dark:bg-gray-900">
            <input
              type="text"
              placeholder="Question Prompt"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              value={q.prompt}
              onChange={(e) => handleChange(index, "prompt", e.target.value)}
            />
            <input
              type="text"
              placeholder="Category (e.g. Communication)"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              value={q.category}
              onChange={(e) => handleChange(index, "category", e.target.value)}
            />
            <button
              className="text-red-500 text-sm"
              onClick={() => handleRemoveQuestion(index)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddQuestion}
        className="text-sm text-blue-600 hover:underline"
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
  );
}
