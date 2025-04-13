"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";

// Define a Question interface for better type checking.
interface Question {
  id?: string;
  prompt: string;
  category: string;
  type: string;
  options: string[];
  subType?: string; // Follow-up type for yes_no_metric questions (e.g. "stars" or "text")
}

// Helper to map local question type to allowed database value.
const mapQuestionType = (type: string) => {
  switch (type) {
    case "stars":
      return "scale";
    case "radio":
      return "radio"; // Preserve radio type instead of mapping to "text"
    case "text":
      return "text";
    case "yes_no_metric":
      return "yes_no_metric";
    default:
      return "scale";
  }
};

// Helper to map database question type back to UI type.
const mapQuestionTypeReverse = (type: string) => {
  switch (type) {
    case "scale":
      return "stars";
    case "radio":
      return "radio"; // Return radio when stored as radio
    case "text":
      return "text";
    case "yes_no_metric":
      return "yes_no_metric";
    default:
      return "stars";
  }
};

export default function SurveyPage() {
  // State for survey creation
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { prompt: "", category: "", type: "stars", options: [], subType: "" }
  ]);
  const [surveyType, setSurveyType] = useState<"course" | "self" | "paired">("course");

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingSurveyId, setEditingSurveyId] = useState<string | null>(null);

  // State for existing surveys list.
  const [existingSurveys, setExistingSurveys] = useState<any[]>([]);

  // Fetch existing surveys from Supabase.
  const fetchSurveys = async () => {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching surveys:", error);
    } else {
      setExistingSurveys(data || []);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Load survey data for editing.
  const loadSurveyForEdit = async (surveyId: string) => {
    // Get survey details.
    const { data: surveyData, error: surveyError } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", surveyId)
      .single();
    if (surveyError || !surveyData) {
      console.error("Error loading survey:", surveyError);
      return;
    }

    let type: "course" | "self" | "paired" = "course";
    if (surveyData.is_self_survey) {
      type = "self";
    } else if (surveyData.name && (surveyData.name.includes("(Self)") || surveyData.name.includes("(Peer)"))) {
      type = "paired";
    }

    // Get survey questions.
    const { data: questionData, error: questionError } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", surveyId);
    if (questionError) {
      console.error("Error loading survey questions:", questionError);
      return;
    }

    // Map questions to our format.
    const mappedQuestions: Question[] = (questionData || []).map((q: any) => {
      const mappedType = mapQuestionTypeReverse(q.question_type);
      return {
        id: q.id,
        prompt: q.question_text || q.prompt || "",
        category: q.category || "General",
        type: mappedType,
        options: q.options || [],
        subType: q.sub_type || ""
      };
    });

    setTitle(surveyData.title || surveyData.name || "");
    setSurveyType(type);
    setQuestions(
      mappedQuestions.length > 0
        ? mappedQuestions
        : [{ prompt: "", category: "", type: "stars", options: [], subType: "" }]
    );
    setIsEditing(true);
    setEditingSurveyId(surveyId);
  };

  // Handlers for survey creation fields.
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { prompt: "", category: "", type: "stars", options: [], subType: "" }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) {
      // Ensure at least one question exists.
      setQuestions([{ prompt: "", category: "", type: "stars", options: [], subType: "" }]);
    } else {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleChange = (
    index: number,
    field: "prompt" | "category" | "type",
    value: string
  ) => {
    const updated = [...questions];
    if (field === "type") {
      updated[index][field] = value;
      // For radio questions, preserve options array; otherwise clear options.
      if (value === "radio" && !updated[index].options) {
        updated[index].options = [];
      } else if (value !== "radio") {
        updated[index].options = [];
      }
      // For yes_no_metric, optionally set a follow-up subtype.
      if (value === "yes_no_metric") {
        updated[index].subType = "stars";
      } else {
        updated[index].subType = "";
      }
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  // Handler for changing the follow-up type (subType).
  const handleChangeSubType = (questionIndex: number, newSubType: string) => {
    const updated = [...questions];
    updated[questionIndex].subType = newSubType;
    setQuestions(updated);
  };

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

  const handleChangeOption = (
    questionIndex: number,
    optionIndex: number,
    newValue: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = newValue;
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
    if (!title.trim() || questions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }

    // If editing an existing survey, remove its questions first.
    if (isEditing && editingSurveyId) {
      const { error: deleteError } = await supabase
        .from("survey_questions")
        .delete()
        .eq("survey_id", editingSurveyId);
      if (deleteError) {
        console.error("Error deleting existing questions:", deleteError);
        alert("Failed to update survey. Error: " + (deleteError?.message || "Unknown error"));
        return;
      }

      const updatePayload = {
        name: title,
        title: title
      };

      const { error: updateError } = await supabase
        .from("surveys")
        .update(updatePayload)
        .eq("id", editingSurveyId);
      if (updateError) {
        console.error("Error updating survey:", updateError);
        alert("Failed to update survey. Error: " + (updateError?.message || "Unknown error"));
        return;
      }

      // Create new questions for the updated survey.
      const questionInserts = questions.map((q) => ({
        survey_id: editingSurveyId,
        question_text: q.prompt,
        category: q.type !== "radio" ? (q.category || "General") : null,
        question_type: mapQuestionType(q.type),
        options: q.type === "radio" ? q.options : null,
        sub_type: q.type === "yes_no_metric" ? q.subType || null : null
      }));

      const { error: qError } = await supabase
        .from("survey_questions")
        .insert(questionInserts);
      if (qError) {
        console.error("Failed to insert questions for survey", editingSurveyId, "Error:", qError);
        alert("Failed to insert questions. Error: " + (qError?.message || "Unknown error"));
        return;
      }

      alert("Survey updated successfully!");
      handleCancel();
      fetchSurveys();
      return;
    }

    // For creating a new survey, prepare payload(s) based on the survey type.
    let surveyPayloads;
    if (surveyType === "paired") {
      surveyPayloads = [
        { 
          name: `${title} (Self)`, 
          title: title,
          is_self_survey: true, 
          is_peer_survey: false, 
          is_course_survey: false 
        },
        { 
          name: `${title} (Peer)`, 
          title: title,
          is_peer_survey: true, 
          is_self_survey: false, 
          is_course_survey: false 
        }
      ];
    } else if (surveyType === "self") {
      surveyPayloads = [{
        name: title,
        title: title,
        is_self_survey: true,
        is_peer_survey: false,
        is_course_survey: false
      }];
    } else {
      surveyPayloads = [{
        name: title,
        title: title,
        is_course_survey: true,
        is_self_survey: false,
        is_peer_survey: false
      }];
    }

    // Loop through the payloads to create survey records and questions.
    for (const payload of surveyPayloads) {
      console.log("Creating survey with payload:", payload);
      const { data: survey, error } = await supabase
        .from("surveys")
        .insert(payload)
        .select()
        .single();
      if (error || !survey) {
        console.error("Failed to create survey with payload", payload, "Error:", error);
        alert("Failed to create survey. Error: " + (error?.message || "Unknown error"));
        return;
      }

      const questionInserts = questions.map((q) => ({
        survey_id: survey.id,
        question_text: q.prompt,
        category: q.type !== "radio" ? (q.category || "General") : null,
        question_type: mapQuestionType(q.type),
        options: q.type === "radio" ? q.options : null,
        sub_type: q.type === "yes_no_metric" ? q.subType || null : null
      }));

      const { error: qError } = await supabase
        .from("survey_questions")
        .insert(questionInserts);
      if (qError) {
        console.error("Failed to insert questions for survey", survey.id, "Error:", qError);
        alert("Failed to insert questions. Error: " + (qError?.message || "Unknown error"));
        return;
      }
    }

    alert("Survey(s) created successfully!");
    handleCancel();
    fetchSurveys();
  };

  // Stub for delete survey functionality (implement as needed).
  const handleDeleteSurvey = async (surveyId: string) => {
    alert(`Delete survey ${surveyId} functionality not implemented.`);
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
        <label className="block text-sm font-medium mt-4 mb-1 text-white">
          Survey Type
        </label>
        <select
          value={surveyType}
          onChange={(e) => setSurveyType(e.target.value as "course" | "self" | "paired")}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white bg-white"
          disabled={isEditing}
        >
          <option value="course">Course Survey</option>
          <option value="self">Self Reflection</option>
          <option value="paired">Paired (Self + Peer)</option>
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
                <option value="yes_no_metric">Yes/No with Metric</option>
              </select>
              {q.type === "radio" && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Options:</p>
                  {q.options && q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        className="w-full p-2 border rounded bg-gray-800 text-white"
                        value={option}
                        onChange={(e) => handleChangeOption(index, optIndex, e.target.value)}
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
              {q.type === "yes_no_metric" && (
                <div className="mt-2 space-y-2">
                  <label className="block text-sm font-medium">Follow-up Type</label>
                  <select
                    className="w-full p-2 border rounded bg-gray-800 text-white"
                    value={q.subType || "stars"}
                    onChange={(e) => handleChangeSubType(index, e.target.value)}
                  >
                    <option value="stars">1–5 Star Rating</option>
                    <option value="text">Short Text</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove
                </button>
                {index === questions.length - 1 && (
                  <button
                    onClick={handleAddQuestion}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" /> Add Question
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded"
          >
            {isEditing ? "Update Survey" : "Save Survey"}
          </button>
        </div>
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-white">Existing Surveys</h2>
          {existingSurveys.length === 0 ? (
            <p className="text-white">No surveys found.</p>
          ) : (
            <ul className="space-y-2">
              {existingSurveys.map((survey) => (
                <li key={survey.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                  <div>
                    <span className="text-white">{survey.name}</span>
                    <div className="flex gap-1 mt-1">
                      {survey.is_course_survey && (
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                          Course
                        </span>
                      )}
                      {survey.is_self_survey && (
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                          Self
                        </span>
                      )}
                      {survey.is_peer_survey && (
                        <span className="bg-yellow-600 text-white px-2 py-0.5 rounded-full text-xs">
                          Peer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadSurveyForEdit(survey.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center"
                      disabled={isEditing}
                    >
                      <FaPencilAlt className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSurvey(survey.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                      disabled={isEditing}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
