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
  const [editingSurveyId, setEditingSurveyId] = useState<string | null>(null);
  const [existingSurveys, setExistingSurveys] = useState<any[]>([]);

  const fetchSurveys = async () => {
    const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
    if (!error) setExistingSurveys(data || []);
  };

  useEffect(() => { fetchSurveys(); }, []);

  const loadSurveyForEdit = async (surveyId: string) => {
    const { data: surveyData } = await supabase.from("surveys").select("*").eq("id", surveyId).single();
    const { data: questionData } = await supabase.from("survey_questions").select("*").eq("survey_id", surveyId);

    if (surveyData) {
      const mappedQuestions: Question[] = (questionData || []).map((q: any) => ({
        id: q.id,
        prompt: q.question_text || "",
        category: q.category || "General",
        type: mapQuestionTypeReverse(q.question_type),
        options: q.options || [],
        subType: q.sub_type || ""
      }));
      setTitle(surveyData.title || surveyData.name || "");
      setSurveyType(
        surveyData.is_self_survey ? "self" :
        (surveyData.name?.includes("(Self)") || surveyData.name?.includes("(Peer)")) ? "paired" : "course"
      );
      setQuestions(mappedQuestions.length > 0 ? mappedQuestions : [{ prompt: "", category: "", type: "stars", options: [], subType: "" }]);
      setEditingSurveyId(surveyId);
      setIsEditing(true);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    const confirmed = confirm("Are you sure you want to delete this survey?");
    if (!confirmed) return;

    const { error: questionDeleteError } = await supabase
      .from("survey_questions")
      .delete()
      .eq("survey_id", surveyId);
    if (questionDeleteError) {
      console.error("Error deleting survey questions:", questionDeleteError);
      alert("Failed to delete survey questions.");
      return;
    }

    const { error: surveyDeleteError } = await supabase
      .from("surveys")
      .delete()
      .eq("id", surveyId);
    if (surveyDeleteError) {
      console.error("Error deleting survey:", surveyDeleteError);
      alert("Failed to delete survey.");
      return;
    }

    alert("✅ Survey deleted successfully!");
    fetchSurveys();
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { prompt: "", category: "", type: "stars", options: [], subType: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.length === 1 ? [{ prompt: "", category: "", type: "stars", options: [], subType: "" }] : questions.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: "prompt" | "category" | "type", value: string) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === "type") {
      if (value === "radio") {
        updated[index].options = updated[index].options || [];
      } else {
        updated[index].options = [];
      }
      updated[index].subType = value === "yes_no_metric" ? "stars" : "";
    }
    setQuestions(updated);
  };

  const handleChangeOption = (qIndex: number, oIndex: number, newVal: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = newVal;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updated);
  };

  const handleChangeSubType = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].subType = value;
    setQuestions(updated);
  };

  const handleCancel = () => {
    setTitle("");
    setQuestions([{ prompt: "", category: "", type: "stars", options: [], subType: "" }]);
    setSurveyType("course");
    setIsEditing(false);
    setEditingSurveyId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) return alert("Please provide a title and at least one question.");

    if (isEditing && editingSurveyId) {
      await supabase.from("survey_questions").delete().eq("survey_id", editingSurveyId);
      await supabase.from("surveys").update({ name: title, title }).eq("id", editingSurveyId);
      const questionInserts = questions.map((q) => ({
        survey_id: editingSurveyId,
        question_text: q.prompt,
        category: q.type !== "radio" ? q.category || "General" : null,
        question_type: mapQuestionType(q.type),
        options: q.type === "radio" ? q.options : null,
        sub_type: q.type === "yes_no_metric" ? q.subType || null : null
      }));
      await supabase.from("survey_questions").insert(questionInserts);
      alert("Survey updated!");
      handleCancel();
      fetchSurveys();
      return;
    }

    let surveyPayloads;
    if (surveyType === "paired") {
      surveyPayloads = [
        { name: `${title} (Self)`, title, is_self_survey: true, is_peer_survey: false, is_course_survey: false },
        { name: `${title} (Peer)`, title, is_self_survey: false, is_peer_survey: true, is_course_survey: false },
      ];
    } else {
      surveyPayloads = [{
        name: title,
        title,
        is_self_survey: surveyType === "self",
        is_peer_survey: false,
        is_course_survey: surveyType === "course"
      }];
    }

    for (const payload of surveyPayloads) {
      const { data: survey } = await supabase.from("surveys").insert(payload).select().single();
      const questionInserts = questions.map((q) => ({
        survey_id: survey.id,
        question_text: q.prompt,
        category: q.type !== "radio" ? q.category || "General" : null,
        question_type: mapQuestionType(q.type),
        options: q.type === "radio" ? q.options : null,
        sub_type: q.type === "yes_no_metric" ? q.subType || null : null
      }));
      await supabase.from("survey_questions").insert(questionInserts);
    }

    alert("Survey(s) created!");
    handleCancel();
    fetchSurveys();
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold text-white">
          {isEditing ? "Edit Survey" : "Create New Survey"}
        </h2>
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
          onChange={(e) => setSurveyType(e.target.value as any)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white bg-white"
          disabled={isEditing}
        >
          <option value="course">Course Survey</option>
          <option value="self">Self Reflection</option>
          <option value="paired">Paired (Self + Peer)</option>
        </select>

        {questions.map((q, index) => (
          <div key={index} className="p-4 border rounded bg-gradient-to-br from-gray-800 to-gray-900 text-white space-y-3">
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-800 text-white"
              placeholder="Question Prompt"
              value={q.prompt}
              onChange={(e) => handleChange(index, "prompt", e.target.value)}
            />
            {q.type !== "radio" && (
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-800 text-white"
                placeholder="Category"
                value={q.category}
                onChange={(e) => handleChange(index, "category", e.target.value)}
              />
            )}
            <select
              className="w-full p-2 border rounded bg-gray-800 text-white"
              value={q.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            >
              <option value="stars">⭐ Star Rating</option>
              <option value="radio">🔘 Multiple Choice</option>
              <option value="text">✍️ Short Text</option>
              <option value="yes_no_metric">Yes/No with Metric</option>
            </select>

            {q.type === "radio" && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-gray-800 text-white"
                      value={opt}
                      onChange={(e) => handleChangeOption(index, i, e.target.value)}
                    />
                    <button className="text-red-500" onClick={() => handleRemoveOption(index, i)}>❌</button>
                  </div>
                ))}
                <button onClick={() => handleAddOption(index)} className="text-blue-400 hover:underline">➕ Add Option</button>
              </div>
            )}

            {q.type === "yes_no_metric" && (
              <div>
                <label className="text-sm">Follow-up Type</label>
                <select
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  value={q.subType}
                  onChange={(e) => handleChangeSubType(index, e.target.value)}
                >
                  <option value="stars">1–5 Star Rating</option>
                  <option value="text">Short Text</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => handleRemoveQuestion(index)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">
                <FaTrash className="mr-1" /> Remove
              </button>
              {index === questions.length - 1 && (
                <button onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">
                  <FaPlus className="mr-1" /> Add Question
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          {isEditing && <button onClick={handleCancel} className="bg-gray-600 text-white px-6 py-2 rounded">Cancel</button>}
          <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded">
            {isEditing ? "Update Survey" : "Save Survey"}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white">Existing Surveys</h2>
          <ul className="space-y-2 mt-4">
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
                    <FaPencilAlt className="mr-1 inline" /> Edit
                  </button>
                  <button onClick={() => handleDeleteSurvey(s.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    <FaTrash className="mr-1 inline" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseLayout>
  );
}
