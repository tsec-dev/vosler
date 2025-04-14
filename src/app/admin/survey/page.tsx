// src/app/survey-editor/page.tsx or wherever your SurveyPage lives
"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";

interface Question {
  id?: string;
  prompt: string;
  category: string;
  type: string;
  options: string[];
  subType?: string;
}

const mapQuestionType = (type: string) => {
  switch (type) {
    case "stars": return "scale";
    case "radio": return "radio";
    case "text": return "text";
    case "yes_no_metric": return "yes_no_metric";
    default: return "scale";
  }
};

const mapQuestionTypeReverse = (type: string) => {
  switch (type) {
    case "scale": return "stars";
    case "radio": return "radio";
    case "text": return "text";
    case "yes_no_metric": return "yes_no_metric";
    default: return "stars";
  }
};

export default function SurveyPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { prompt: "", category: "", type: "stars", options: [], subType: "" }
  ]);
  const [surveyType, setSurveyType] = useState<"course" | "self" | "paired">("course");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSurveyIds, setEditingSurveyIds] = useState<{ self?: string; peer?: string; single?: string }>({});
  const [existingSurveys, setExistingSurveys] = useState<any[]>([]);

  const fetchSurveys = async () => {
    const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
    if (!error) setExistingSurveys(data || []);
  };

  useEffect(() => { fetchSurveys(); }, []);

  const loadSurveyForEdit = async (surveyId: string) => {
    const { data: surveyData } = await supabase.from("surveys").select("*").eq("id", surveyId).single();
    const { data: questionData } = await supabase.from("survey_questions").select("*").eq("survey_id", surveyId);

    if (!surveyData) return;

    const type: "course" | "self" | "paired" = surveyData.is_course_survey
      ? "course"
      : surveyData.name?.includes("(Self)") || surveyData.name?.includes("(Peer)")
      ? "paired"
      : "self";

    const baseTitle = surveyData.title || surveyData.name.replace(" (Self)", "").replace(" (Peer)", "");

    const mappedQuestions: Question[] = (questionData || []).map((q: any) => ({
      id: q.id,
      prompt: q.question_text || "",
      category: q.category || "General",
      type: mapQuestionTypeReverse(q.question_type),
      options: q.options || [],
      subType: q.sub_type || ""
    }));

    setTitle(baseTitle);
    setSurveyType(type);
    setQuestions(mappedQuestions.length > 0 ? mappedQuestions : [{ prompt: "", category: "", type: "stars", options: [], subType: "" }]);

    if (type === "paired") {
      const { data: all } = await supabase.from("surveys").select("id, name").like("name", `%${baseTitle}%`);
      const self = all?.find((s) => s.name.includes("(Self)"));
      const peer = all?.find((s) => s.name.includes("(Peer)"));
      setEditingSurveyIds({ self: self?.id, peer: peer?.id });
    } else {
      setEditingSurveyIds({ single: surveyId });
    }

    setIsEditing(true);
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    const confirmed = confirm("Are you sure you want to delete this survey?");
    if (!confirmed) return;

    await supabase.from("survey_questions").delete().eq("survey_id", surveyId);
    await supabase.from("surveys").delete().eq("id", surveyId);

    alert("✅ Survey deleted successfully!");
    fetchSurveys();
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) return alert("Please provide a title and at least one question.");

    const insertQuestions = async (surveyId: string) => {
      const inserts = questions.map((q) => ({
        survey_id: surveyId,
        question_text: q.prompt,
        category: q.type !== "radio" ? q.category || "General" : null,
        question_type: mapQuestionType(q.type),
        options: q.type === "radio" ? q.options : null,
        sub_type: q.type === "yes_no_metric" ? q.subType || null : null
      }));
      await supabase.from("survey_questions").insert(inserts);
    };

    if (isEditing) {
      if (surveyType === "paired") {
        const { self, peer } = editingSurveyIds;
        for (const id of [self, peer]) {
          await supabase.from("survey_questions").delete().eq("survey_id", id);
          await supabase.from("surveys").update({ name: `${title} ${id === self ? "(Self)" : "(Peer)"}`, title }).eq("id", id);
          await insertQuestions(id!);
        }
      } else {
        const { single } = editingSurveyIds;
        await supabase.from("survey_questions").delete().eq("survey_id", single);
        await supabase.from("surveys").update({ name: title, title }).eq("id", single);
        await insertQuestions(single!);
      }

      alert("Survey updated!");
      handleCancel();
      fetchSurveys();
      return;
    }

    const payloads = surveyType === "paired"
      ? [
          { name: `${title} (Self)`, title, is_self_survey: true, is_peer_survey: false, is_course_survey: false },
          { name: `${title} (Peer)`, title, is_self_survey: false, is_peer_survey: true, is_course_survey: false }
        ]
      : [
          {
            name: title,
            title,
            is_self_survey: surveyType === "self",
            is_peer_survey: false,
            is_course_survey: surveyType === "course"
          }
        ];

    for (const payload of payloads) {
      const { data: created } = await supabase.from("surveys").insert(payload).select().single();
      await insertQuestions(created.id);
    }

    alert("Survey(s) created!");
    handleCancel();
    fetchSurveys();
  };

  const handleCancel = () => {
    setTitle("");
    setSurveyType("course");
    setIsEditing(false);
    setEditingSurveyIds({});
    setQuestions([{ prompt: "", category: "", type: "stars", options: [], subType: "" }]);
  };

  const handleAddQuestion = () => setQuestions([...questions, { prompt: "", category: "", type: "stars", options: [], subType: "" }]);
  const handleRemoveQuestion = (i: number) => setQuestions(questions.length === 1 ? [{ prompt: "", category: "", type: "stars", options: [], subType: "" }] : questions.filter((_, idx) => i !== idx));

  const handleChange = (i: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[i][field] = value;
    if (field === "type") {
      updated[i].options = value === "radio" ? [] : [];
      updated[i].subType = value === "yes_no_metric" ? "stars" : "";
    }
    setQuestions(updated);
  };

  const handleOption = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = val;
    setQuestions(updated);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-white">{isEditing ? "Edit Survey" : "Create New Survey"}</h2>

        <input
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <select
          value={surveyType}
          onChange={(e) => setSurveyType(e.target.value as any)}
          disabled={isEditing}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="course">Course Survey</option>
          <option value="self">Self Reflection</option>
          <option value="paired">Paired (Self + Peer)</option>
        </select>

        {questions.map((q, index) => (
          <div key={index} className="bg-gray-800 text-white p-4 rounded space-y-2">
            <input className="w-full p-2 rounded bg-gray-700" placeholder="Prompt" value={q.prompt} onChange={(e) => handleChange(index, "prompt", e.target.value)} />
            {q.type !== "radio" && (
              <input className="w-full p-2 rounded bg-gray-700" placeholder="Category" value={q.category} onChange={(e) => handleChange(index, "category", e.target.value)} />
            )}
            <select className="w-full p-2 rounded bg-gray-700" value={q.type} onChange={(e) => handleChange(index, "type", e.target.value)}>
              <option value="stars">⭐ Star Rating</option>
              <option value="radio">🔘 Multiple Choice</option>
              <option value="text">✍️ Short Text</option>
              <option value="yes_no_metric">Yes/No with Metric</option>
            </select>

            {q.type === "radio" && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="w-full p-2 rounded bg-gray-700" value={opt} onChange={(e) => handleOption(index, i, e.target.value)} />
                    <button onClick={() => handleRemoveQuestion(index)} className="text-red-500">❌</button>
                  </div>
                ))}
                <button onClick={() => setQuestions(qs => { qs[index].options.push(""); return [...qs]; })} className="text-blue-400 hover:underline">➕ Add Option</button>
              </div>
            )}

            {q.type === "yes_no_metric" && (
              <select className="w-full p-2 rounded bg-gray-700" value={q.subType} onChange={(e) => handleChange(index, "subType", e.target.value)}>
                <option value="stars">⭐ Star Rating</option>
                <option value="text">✍️ Short Text</option>
              </select>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button onClick={handleAddQuestion} className="bg-blue-600 text-white px-4 py-2 rounded">Add Question</button>
          {isEditing && <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>}
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">{isEditing ? "Update Survey" : "Save Survey"}</button>
        </div>

        <h3 className="text-2xl text-white mt-8">Existing Surveys</h3>
        <ul className="space-y-2 mt-2">
          {existingSurveys.map((s) => (
            <li key={s.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
              <div>
                <p className="text-white font-medium">{s.name}</p>
                <div className="flex gap-2 mt-1">
                  {s.is_course_survey && <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs text-white">Course</span>}
                  {s.is_self_survey && <span className="bg-green-600 px-2 py-0.5 rounded-full text-xs text-white">Self</span>}
                  {s.is_peer_survey && <span className="bg-yellow-600 px-2 py-0.5 rounded-full text-xs text-white">Peer</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => loadSurveyForEdit(s.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                  <FaPencilAlt className="inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDeleteSurvey(s.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BaseLayout>
  );
}
