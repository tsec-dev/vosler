"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PlusCircle, Trash2, Save } from "lucide-react";

export default function SurveyBuilderPage() {

  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newSurveyName, setNewSurveyName] = useState("");

  // Fetch existing surveys on load
  useEffect(() => {
    const fetchSurveys = async () => {
      const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
      if (error) console.error(error);
      else setSurveys(data);
    };
    fetchSurveys();
  }, []);

  // Load questions when survey is selected
  useEffect(() => {
    if (!selectedSurvey) return;
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", selectedSurvey.id)
        .order("position", { ascending: true });

      if (error) console.error(error);
      else setQuestions(data);
    };
    fetchQuestions();
  }, [selectedSurvey]);

  const createSurvey = async () => {
    if (!newSurveyName.trim()) return;
    const { data, error } = await supabase.from("surveys").insert({ name: newSurveyName }).select().single();
    if (error) console.error(error);
    else {
      setSurveys([data, ...surveys]);
      setNewSurveyName("");
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        question_text: "",
        question_type: "text",
        required: false,
        isNew: true,
      },
    ]);
  };

  const saveQuestions = async () => {
    if (!selectedSurvey) return;

    const upserts = questions.map((q, i) => ({
      survey_id: selectedSurvey.id,
      question_text: q.question_text,
      question_type: q.question_type,
      required: q.required,
      position: i,
      ...(q.isNew ? {} : { id: q.id }), // only include ID if it's an update
    }));

    const { error } = await supabase.from("survey_questions").upsert(upserts, { onConflict: "id" });
    if (error) console.error(error);
    else alert("Questions saved!");
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📝 Course Survey Builder</h1>

      {/* Create Survey */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create a New Survey</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newSurveyName}
            onChange={(e) => setNewSurveyName(e.target.value)}
            placeholder="e.g. Week 1 Feedback"
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button onClick={createSurvey} className="bg-indigo-600 text-white px-4 py-2 rounded">
            <PlusCircle className="inline-block w-4 h-4 mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Survey List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Select a Survey</h2>
        <div className="flex gap-2 flex-wrap">
          {surveys.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSurvey(s)}
              className={`px-4 py-2 rounded border ${
                selectedSurvey?.id === s.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Question Editor */}
      {selectedSurvey && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Questions for: {selectedSurvey.name}</h2>
          <div className="space-y-4 mb-6">
            {questions.map((q, index) => (
              <div key={q.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded space-y-2">
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, question_text: e.target.value } : item))
                    )
                  }
                  placeholder="Enter your question"
                  className="w-full p-2 border rounded"
                />
                <select
                  value={q.question_type}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, question_type: e.target.value } : item))
                    )
                  }
                  className="p-2 border rounded"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Yes / No</option>
                  <option value="scale">1–5 Scale</option>
                </select>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((item, i) => (i === index ? { ...item, required: e.target.checked } : item))
                      )
                    }
                  />
                  Required
                </label>
                <button onClick={() => deleteQuestion(q.id)} className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={addQuestion} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add Question
            </button>
            <button onClick={saveQuestions} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
