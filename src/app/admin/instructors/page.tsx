"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, UserPlus } from "lucide-react";

interface Instructor {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export default function InstructorOnboarding() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchInstructors = async () => {
    const { data, error } = await supabase.from("instructors").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error fetching instructors", error);
    else setInstructors(data || []);
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleAdd = async () => {
    if (!email.trim()) return alert("Email is required");

    const { error } = await supabase.from("instructors").insert({
      email: email.toLowerCase(),
      full_name: name,
      is_admin: true,
    });

    if (error) {
      alert("Error adding instructor");
      return;
    }

    // 📡 Call backend API to promote or invite via Clerk
    await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        metadata: { admin: true },
      }),
    });

    setName("");
    setEmail("");
    fetchInstructors();
  };

  const handleDelete = async (instructorId: string, instructorEmail: string) => {
    const confirmDelete = confirm("Remove instructor and revoke access?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("instructors").delete().eq("id", instructorId);
    if (error) {
      alert("Failed to remove instructor.");
      return;
    }

    // 📡 Call API to demote in Clerk
    await fetch(`/api/invite/demote?email=${encodeURIComponent(instructorEmail)}`);

    fetchInstructors();
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">👨‍🏫 Instructor Onboarding</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Instructor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
            />
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Add Instructor
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Instructors</h2>
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {instructors.map((instructor) => (
              <li key={instructor.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{instructor.full_name || "—"}</p>
                  <p className="text-sm text-gray-500">{instructor.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(instructor.id, instructor.email)}
                  className="text-red-600 hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseLayout>
  );
}
