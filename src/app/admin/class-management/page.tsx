"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";

interface Instructor {
  id: string;
  full_name: string;
  email: string;
}

interface ClassTemplate {
  id: string;
  name: string;
}

export default function ClassManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [classTemplates, setClassTemplates] = useState<ClassTemplate[]>([]);

  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [inst, templates] = await Promise.all([
        supabase.from("instructors").select("*").order("full_name"),
        supabase.from("class_templates").select("*").order("name"),
      ]);

      if (inst.data) setInstructors(inst.data);
      if (templates.data) setClassTemplates(templates.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!className || !startDate || !endDate || !instructorId) {
      alert("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("classes").insert({
      name: className,
      start_date: startDate,
      end_date: endDate,
      instructor_id: instructorId,
    });

    if (error) {
      console.error("Failed to create class:", error);
      setMessage("❌ Failed to create class.");
    } else {
      setMessage("✅ Class created successfully!");
      setClassName("");
      setStartDate("");
      setEndDate("");
      setInstructorId("");
    }

    setSubmitting(false);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Create New Class</h1>

        <div className="space-y-4">
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
          >
            <option value="" disabled>
              Select Class Name
            </option>
            {classTemplates.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
            />
          </div>

          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
          >
            <option value="" disabled>
              Assign Instructor
            </option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.full_name || inst.email}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium"
          >
            {submitting ? "Creating..." : "Create Class"}
          </button>

          {message && <p className="text-sm mt-2">{message}</p>}
        </div>
      </div>
    </BaseLayout>
  );
}
