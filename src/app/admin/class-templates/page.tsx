"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, PlusCircle } from "lucide-react";

export default function ClassTemplatesPage() {
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [newName, setNewName] = useState("");

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from("class_templates").select("*").order("created_at");
    if (error) console.error("Error fetching templates", error);
    else setTemplates(data || []);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const { error } = await supabase.from("class_templates").insert({ name: newName });
    if (error) {
      alert("Error adding template. It might already exist.");
    } else {
      setNewName("");
      fetchTemplates();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this class name?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("class_templates").delete().eq("id", id);
    if (error) alert("Failed to delete.");
    else fetchTemplates();
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">🏷️ Manage Class Name Templates</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="New Class Name (e.g. SNCOA Bravo)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add
          </button>
        </div>

        <ul className="divide-y divide-gray-300 dark:divide-gray-700">
          {templates.map((template) => (
            <li key={template.id} className="py-3 flex justify-between items-center">
              <span className="text-sm text-gray-800 dark:text-white">{template.name}</span>
              <button onClick={() => handleDelete(template.id)} className="text-red-600 hover:text-red-400">
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </BaseLayout>
  );
}
