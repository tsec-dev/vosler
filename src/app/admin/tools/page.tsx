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

interface Announcement {
  id: string;
  class_id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminToolsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<string>("moderation");
  
  // Form state for announcements
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    supabase.from("classes").select("id, name").then(({ data }) => {
      if (data) {
        setClasses(data);
        // Select the first class by default if available
        if (data.length > 0 && !selectedClassId) {
          setSelectedClassId(data[0].id);
        }
      }
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
    
    // Load announcements
    loadAnnouncements(selectedClassId);
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
  
  const loadAnnouncements = async (classId: string) => {
    const { data, error } = await supabase
      .from('class_announcements')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Announcements query error:", error);
      return;
    }
    
    setAnnouncements(data || []);
  };

  const updateApproval = async (id: string, approved: boolean) => {
    await supabase.from("survey_comments").update({ approved }).eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };
  
  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    
    if (!selectedClassId) {
      setFormError("Please select a class first");
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('class_announcements')
        .insert([
          { 
            class_id: selectedClassId, 
            title: title.trim(), 
            content: content.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Clear form and show success message
      setTitle("");
      setContent("");
      setFormSuccess("Announcement posted successfully!");
      
      // Reload announcements
      loadAnnouncements(selectedClassId);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-7xl mx-auto p-6">
        {/* Class Selector */}
        <div className="mb-6">
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Class
          </label>
          <select
            id="class-select"
            className="w-full md:w-1/3 p-2 border rounded dark:bg-gray-800 dark:text-white"
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
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'moderation' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('moderation')}
          >
            📝 Moderation & Trends
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'announcements' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('announcements')}
          >
            📢 Announcements
          </button>
        </div>
        
        {activeTab === 'moderation' && (
          <div className="flex flex-col lg:flex-row gap-6">
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
        )}
        
        {activeTab === 'announcements' && (
          <div className="space-y-8">
            {/* Create Announcement Form */}
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Create New Announcement
              </h2>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {formSuccess}
                </div>
              )}
              
              <form onSubmit={handleAnnouncementSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter announcement title"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Announcement Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={5}
                    placeholder="Enter announcement content"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedClassId}
                  className={`px-4 py-2 rounded text-white font-medium ${
                    isSubmitting || !selectedClassId 
                      ? "bg-gray-500 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {isSubmitting ? "Posting..." : "Post Announcement"}
                </button>
              </form>
            </div>
            
            {/* Existing Announcements */}
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Current Announcements
              </h2>
              
              {!selectedClassId ? (
                <p className="text-gray-500">Please select a class to view announcements.</p>
              ) : announcements.length === 0 ? (
                <p className="text-gray-500">No announcements have been posted for this class yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{announcement.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">{announcement.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted: {new Date(announcement.created_at).toLocaleDateString()} at{" "}
                        {new Date(announcement.created_at).toLocaleTimeString()}
                      </p>
                      <div className="flex mt-3">
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this announcement?")) {
                              await supabase
                                .from('class_announcements')
                                .delete()
                                .eq('id', announcement.id);
                              loadAnnouncements(selectedClassId);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}