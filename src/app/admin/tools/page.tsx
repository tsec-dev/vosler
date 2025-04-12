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

interface Trend {
  user: string;
  category: string;
  selfavg: number;
  peeravg: number;
  gap: number;
}

export default function AdminToolsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);

  useEffect(() => {
    supabase.from("classes").select("id, name").then(({ data }) => {
      if (data) setClasses(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    // Load comments
    supabase
      .from("survey_comments")
      .select("*")
      .eq("approved", false)
      .eq("class_id", selectedClassId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments(data || []));

    // Load trends
    loadTrends(selectedClassId);
  }, [selectedClassId]);

  const loadTrends = async (classId: string) => {
    const { data, error } = await supabase.rpc("get_self_peer_gaps", {
      class_filter: classId,
    });

    if (error) {
      console.error("Trend query error:", error);
      return;
    }

    setTrends(data || []);
  };

  const updateApproval = async (id: string, approved: boolean) => {
    await supabase.from("survey_comments").update({ approved }).eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-6">
        {/* LEFT SIDE: TRENDS */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h2 className="text-xl font-bold">📉 Trends</h2>
          {trends.length === 0 && selectedClassId && (
            <p className="text-sm text-gray-500">No trends found.</p>
          )}
          {trends.slice(0, 5).map((t, index) => (
            <div key={index} className="p-4 border rounded bg-white dark:bg-gray-900 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>{t.user}</strong> may need support in <strong>{t.category}</strong>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Self Avg: {t.selfavg?.toFixed(1)} | Peer Avg: {t.peeravg?.toFixed(1)} | Gap: {t.gap?.toFixed(1)}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: MODERATION */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-bold mb-2">📝 Peer Feedback Moderation</h2>
          <select
            className="w-full p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
            value={selectedClassId || ""}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="" disabled>Select a class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {comments.length === 0 && selectedClassId && (
            <p className="text-gray-500 text-sm">✅ No pending comments for this class.</p>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded bg-white dark:bg-gray-900 shadow">
                <div className="text-sm text-gray-500 mb-1">
                  <strong>Student:</strong> {comment.target_user_id} | <strong>Category:</strong> {comment.category}
                </div>
                <p className="mb-3 text-sm">{comment.comment_text}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApproval(comment.id, true)}
                    className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateApproval(comment.id, false)}
                    className="text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
