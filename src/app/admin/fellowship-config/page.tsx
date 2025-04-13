"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";

export default function FellowshipConfigPage() {
  const [fellowshipType, setFellowshipType] = useState("Fellowship I");
  const [templates, setTemplates] = useState<{ week_number: number; theme: string }[]>([
    { week_number: 1, theme: "" },
    { week_number: 2, theme: "" },
    { week_number: 3, theme: "" },
    { week_number: 4, theme: "" },
  ]);

  useEffect(() => {
    // Load saved themes for selected fellowship
    supabase
      .from("fellowship_templates")
      .select("week_number, theme")
      .eq("fellowship_name", fellowshipType)
      .then(({ data }) => {
        if (data?.length) {
          setTemplates(
            [1, 2, 3, 4].map((week) => ({
              week_number: week,
              theme: data.find((d) => d.week_number === week)?.theme || "",
            }))
          );
        } else {
          setTemplates([
            { week_number: 1, theme: "" },
            { week_number: 2, theme: "" },
            { week_number: 3, theme: "" },
            { week_number: 4, theme: "" },
          ]);
        }
      });
  }, [fellowshipType]);

  const handleChange = (week: number, value: string) => {
    const updated = templates.map((t) =>
      t.week_number === week ? { ...t, theme: value } : t
    );
    setTemplates(updated);
  };

  const handleSave = async () => {
    const rows = templates.map((t) => ({
      fellowship_name: fellowshipType,
      week_number: t.week_number,
      theme: t.theme,
    }));

    const { error } = await supabase.from("fellowship_templates").upsert(rows, {
      onConflict: "fellowship_name,week_number",
    });

    if (error) {
      console.error("Save error:", error); // See full message here
      alert(`❌ Failed to save themes:\n${error.message || "Unknown error"}`);
    } else {
      alert("✅ Fellowship themes saved!");
    }
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Fellowship Theme Config</h1>

        <select
          className="mb-6 w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={fellowshipType}
          onChange={(e) => setFellowshipType(e.target.value)}
        >
          <option value="Fellowship I">Fellowship I</option>
          <option value="Fellowship II">Fellowship II</option>
          <option value="Fellowship III">Fellowship III</option>
        </select>

        <div className="space-y-4">
          {templates.map(({ week_number, theme }) => (
            <div key={week_number} className="p-4 border rounded bg-white dark:bg-gray-900 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Week {week_number} Theme
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                value={theme}
                onChange={(e) => handleChange(week_number, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded"
        >
          Save Themes
        </button>
      </div>
    </BaseLayout>
  );
}
