"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";

interface Class {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  comment_text: string;
  approved: boolean;
  category: string;
  target_user_id: string;
}

export default function AdminToolsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    supabase
      .from("classes")
      .select("id, name")
      .then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    supabase
      .from("survey_comments")
      .select("*")
      .eq("approved", false)
      .eq("class_id", selectedClassId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments(data || []));
  }, [selectedClassId]);

  const updateApproval = async (id: string, approved: boolean) => {
    await supabase.from("survey_comments").update({ approved }).eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🛠️ Admin Feedback Moderation</h1>

        <select
          className="w-full p-2 mb-6 border rounded dark:bg-gray-800 dark:text-white"
          value={selectedClassId || ""}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="" disabled>Select a class to moderate...</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        {comments.length === 0 && selectedClassId && (
          <p className="text-gray-500 dark:text-gray-400">✅ No pending comments for this class.</p>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded dark:bg-gray-900 shadow">
              <div className="text-sm text-gray-500 mb-2">
                <strong>Category:</strong> {comment.category} | <strong>Student:</strong> {comment.target_user_id}
              </div>
              <p className="mb-4 text-sm dark:text-white">{comment.comment_text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateApproval(comment.id, true)}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-1 rounded"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => updateApproval(comment.id, false)}
                  className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-1 rounded"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
