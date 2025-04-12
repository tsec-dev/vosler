"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BaseLayout from "@/components/BaseLayout";
import { PlusCircle, Trash2, Save, XCircle } from "lucide-react";

export default function SurveyBuilderPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newSurveyName, setNewSurveyName] = useState("");

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setSurveys(data);
  };

  useEffect(() => {
    if (!selectedSurvey) return;
    fetchQuestions();
  }, [selectedSurvey]);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", selectedSurvey.id)
      .order("position", { ascending: true });

    if (error) console.error(error);
    else setQuestions(data);
  };

  const createSurvey = async () => {
    if (!newSurveyName.trim()) return;
    const { data, error } = await supabase.from("surveys").insert({ name: newSurveyName }).select().single();
    if (error) console.error(error);
    else {
      setSurveys([data, ...surveys]);
      setSelectedSurvey(data);
      setNewSurveyName("");
      setQuestions([]);
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    const confirmed = confirm("Are you sure you want to delete this survey?");
    if (!confirmed) return;

    const { error } = await supabase.from("surveys").delete().eq("id", surveyId);
    if (error) console.error(error);
    else {
      setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
      if (selectedSurvey?.id === surveyId) {
        setSelectedSurvey(null);
        setQuestions([]);
      }
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
      ...(q.isNew ? {} : { id: q.id }),
    }));

    const { error } = await supabase.from("survey_questions").upsert(upserts, { onConflict: "id" });
    if (error) console.error(error);
    else alert("Questions saved!");
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">🧱 Build a Survey</h1>

        {/* Create Survey */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Create New Survey</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newSurveyName}
              onChange={(e) => setNewSurveyName(e.target.value)}
              placeholder="e.g. Week 2 Feedback"
              className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded w-full"
            />
            <button
              onClick={createSurvey}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Survey Selector */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Select a Survey</h2>
          <div className="flex flex-wrap gap-3">
            {surveys.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSurvey(s)}
                  className={`px-4 py-2 rounded border ${
                    selectedSurvey?.id === s.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-900 dark:text-white"
                  }`}
                >
                  {s.name}
                </button>
                <button onClick={() => deleteSurvey(s.id)} className="text-red-500">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Question Builder */}
        {selectedSurvey && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Edit Questions for: {selectedSurvey.name}</h2>
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white dark:bg-gray-900 border rounded-lg p-5 space-y-3 shadow">
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, index) => (index === i ? { ...item, question_text: e.target.value } : item))
                    )
                  }
                  placeholder="Question text..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
                />

                <select
                  value={q.question_type}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((item, index) => (index === i ? { ...item, question_type: e.target.value } : item))
                    )
                  }
                  className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Yes / No</option>
                  <option value="scale">1–5 Scale</option>
                  <option value="stars">Star Rating (1–5)</option>
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((item, index) =>
                          index === i ? { ...item, required: e.target.checked } : item
                        )
                      )
                    }
                  />
                  Required?
                </label>

                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <button
                onClick={addQuestion}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Add Question
              </button>
              <button
                onClick={saveQuestions}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Questions
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
