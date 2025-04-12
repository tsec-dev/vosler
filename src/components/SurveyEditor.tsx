"use client";

import { useState } from "react";

export default function SurveyEditor() {
  const [questions, setQuestions] = useState([
    { id: "q1", text: "Were you present?", type: "boolean" },
    { id: "q2", text: "Rate the session (1–10)", type: "number", min: 1, max: 10 },
    { id: "q3", text: "Comments (optional)", type: "text" },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: "", type: "text" }]);
  };

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = () => {
    console.log("Survey saved:", questions);
    alert("Survey configuration saved locally (integration coming soon).");
  };

  return (
    <div className="bg-white dark:bg-gray-900 border rounded p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Survey Editor</h2>
      {questions.map((question) => (
        <div key={question.id} className="mb-4">
          <input
            type="text"
            value={question.text}
            onChange={(e) => handleUpdateQuestion(question.id, "text", e.target.value)}
            placeholder="Question text"
            className="border p-2 rounded w-full mb-2"
          />
          <button onClick={() => handleDeleteQuestion(question.id)} className="text-red-600 text-sm">
            Delete
          </button>
        </div>
      ))}
      <div className="flex space-x-4">
        <button onClick={handleAddQuestion} className="bg-blue-600 text-white py-2 px-4 rounded">
          Add Question
        </button>
        <button onClick={handleSave} className="bg-green-600 text-white py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}
