"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PlusCircle, Trash2, Save, Eye, XCircle } from "lucide-react";

export default function SurveyBuilderPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newSurveyName, setNewSurveyName] = useState("");

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setSurveys(data);
  }

  useEffect(() => {
    if (!selectedSurvey) return;
    fetchQuestions();
  }, [selectedSurvey]);

  async function fetchQuestions() {
    const { data, error } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", selectedSurvey.id)
      .order("position", { ascending: true });

    if (error) console.error(error);
    else setQuestions(data);
  }

  async function createSurvey() {
    if (!newSurveyName.trim()) return;
    const { data, error } = await supabase.from("surveys").insert({ name: newSurveyName }).select().single();
    if (error) console.error(error);
    else {
      setSurveys([data, ...surveys]);
      setSelectedSurvey(data);
      setNewSurveyName("");
      setQuestions([]);
    }
  }

  async function deleteSurvey(surveyId: string) {
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
  }

  function addQuestion() {
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
  }

  async function saveQuestions() {
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
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📝 Course Survey Builder</h1>

      {/* Create Survey */}
      <div className="mb-10 border-b pb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Survey</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newSurveyName}
            onChange={(e) => setNewSurveyName(e.target.value)}
            placeholder="e.g. Week 2 Feedback"
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button onClick={createSurvey} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Survey Selector */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Select a Survey</h2>
        <div className="flex flex-wrap gap-3">
          {surveys.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSurvey(s)}
                className={`px-4 py-2 rounded border ${
                  selectedSurvey?.id === s.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"
                }`}
              >
                {s.name}
              </button>
              <button onClick={() => deleteSurvey(s.id)} className="text-red-500">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Question Editor */}
      {selectedSurvey && (
        <>
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Edit Questions: {selectedSurvey.name}</h2>
            <div className="space-y-4 mb-6">
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800 space-y-2">
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

          {/* Preview Mode */}
          {questions.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-bold mb-4">🔍 Preview Survey</h2>
              <form className="space-y-6 max-w-2xl">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
                    <label className="block font-medium mb-2">{q.question_text}{q.required && " *"}</label>
                    {q.question_type === "text" && (
                      <textarea className="w-full p-2 border rounded" disabled placeholder="Student would write here..." />
                    )}
                    {q.question_type === "number" && (
                      <input type="number" className="w-full p-2 border rounded" disabled placeholder="Numeric input..." />
                    )}
                    {q.question_type === "boolean" && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" disabled /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" disabled /> No
                        </label>
                      </div>
                    )}
                    {q.question_type === "scale" && (
                      <input type="range" min="1" max="5" disabled className="w-full" />
                    )}
                  </div>
                ))}
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
