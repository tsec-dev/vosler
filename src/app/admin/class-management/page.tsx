"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
import * as XLSX from "xlsx";

interface Instructor {
  id: string;
  full_name: string;
  email: string;
}

interface ClassTemplate {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  instructor_id: string;
  instructor?: Instructor;
  fellowship_name?: string;
}

interface ClassWeek {
  class_id: string;
  week_number: number;
  theme: string;
  start_date?: string;
}

interface StudentInvite {
  id: string;
  email: string;
  class_id: string;
}

export default function ClassManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [classTemplates, setClassTemplates] = useState<ClassTemplate[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classWeeks, setClassWeeks] = useState<ClassWeek[]>([]);
  const [invites, setInvites] = useState<StudentInvite[]>([]);

  // For editing an existing class
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Fields for creating a new class
  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");
  const [fellowshipName, setFellowshipName] = useState("");

  // For inviting students
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Viewing class details in a modal
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UX states
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all data (including invites) on mount.
  useEffect(() => {
    const fetchAll = async () => {
      const [inst, templates, cls, invitesRes, weeksRes] = await Promise.all([
        supabase.from("instructors").select("*"),
        supabase.from("class_templates").select("*"),
        supabase
          .from("classes")
          .select("*, instructor:instructor_id (id, full_name, email)")
          .order("created_at", { ascending: false }),
        supabase.from("class_students").select("*"),
        supabase.from("class_weeks").select("*"),
      ]);

      if (inst.data) setInstructors(inst.data);
      if (templates.data) setClassTemplates(templates.data);
      if (cls.data) setClasses(cls.data);
      if (invitesRes.data) setInvites(invitesRes.data);
      if (weeksRes.data) setClassWeeks(weeksRes.data);
    };

    fetchAll();
  }, []);

  // Helper: Refresh invites from Supabase.
  const refreshInvites = async () => {
    const { data: invitesData, error } = await supabase.from("class_students").select("*");
    if (error) {
      console.error("Error refreshing invites:", error);
    } else if (invitesData) {
      setInvites(invitesData);
    }
  };

  // Calculate current week from class start date.
  const calculateCurrentWeekNumber = (start: string): number => {
    const sDate = new Date(start);
    const now = new Date();
    const diff = now.getTime() - sDate.getTime();
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, weeks + 1);
  };

  // Get current week theme from class_weeks.
  const getCurrentWeekTheme = (classId: string, start: string) => {
    const currentWeek = calculateCurrentWeekNumber(start);
    const match = classWeeks.find(
      (cw) => cw.class_id === classId && cw.week_number === currentWeek
    );
    return match?.theme || null;
  };

  // Create a new class.
  const handleCreateClass = async () => {
    if (!className || !startDate || !endDate || !instructorId || !fellowshipName) {
      alert("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    const { data: createdClass, error } = await supabase
      .from("classes")
      .insert({
        name: className,
        start_date: startDate,
        end_date: endDate,
        instructor_id: instructorId,
        fellowship_name: fellowshipName,
      })
      .select()
      .single();

    if (error || !createdClass) {
      console.error("❌ Failed to create class:", error);
      setMessage("❌ Failed to create class.");
      setSubmitting(false);
      return;
    }

    // Auto-generate class_weeks from fellowship_templates.
    const { data: templates } = await supabase
      .from("fellowship_templates")
      .select("*")
      .eq("fellowship_name", fellowshipName);

    if (templates?.length) {
      const totalWeeks = templates.length;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const weekDuration = Math.floor((end.getTime() - start.getTime()) / totalWeeks);

      const weekRows = templates.map((t) => {
        const offset = (t.week_number - 1) * weekDuration;
        return {
          class_id: createdClass.id,
          week_number: t.week_number,
          theme: t.theme,
          start_date: new Date(start.getTime() + offset).toISOString().split("T")[0],
        };
      });

      await supabase.from("class_weeks").insert(weekRows);
    }

    setMessage("✅ Class created successfully!");
    setClassName("");
    setStartDate("");
    setEndDate("");
    setInstructorId("");
    setFellowshipName("");
    setSubmitting(false);

    // Refresh class list.
    const { data: updated } = await supabase
      .from("classes")
      .select("*, instructor:instructor_id (id, full_name, email)")
      .order("created_at", { ascending: false });

    if (updated) setClasses(updated);
  };

  // Delete a class.
  const handleDeleteClass = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const { error } = await supabase.from("classes").delete().eq("id", classId);
    if (!error) {
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    } else {
      alert("❌ Failed to delete class.");
      console.error(error);
    }
  };

  // Save edited class data.
  const handleEditSave = async () => {
    if (!editingClass) return;

    const { error } = await supabase
      .from("classes")
      .update({
        name: editingClass.name,
        start_date: editingClass.start_date,
        end_date: editingClass.end_date,
        instructor_id: editingClass.instructor_id,
        fellowship_name: editingClass.fellowship_name,
      })
      .eq("id", editingClass.id);

    if (error) {
      alert("❌ Failed to update class.");
      console.error(error);
      return;
    }

    // Refresh class list.
    const { data: refreshed } = await supabase
      .from("classes")
      .select("*, instructor:instructor_id (id, full_name, email)")
      .order("created_at", { ascending: false });

    setClasses(refreshed || []);
    setEditingClass(null);
  };

  // Open view class modal.
  const handleViewClass = (cls: Class) => {
    setViewingClass(cls);
    setIsModalOpen(true);
  };

  // Delete a student invite.
  const handleDeleteStudent = async (inviteId: string) => {
    if (!confirm("Remove this student?")) return;
    const { error } = await supabase.from("class_students").delete().eq("id", inviteId);
    if (!error) {
      // Refresh the invites after deletion.
      await refreshInvites();
    }
  };

  // Single invite with debugging and refresh.
  const handleInvite = async (classId: string) => {
    console.debug("handleInvite invoked");
    console.debug("Invite Email:", inviteEmail);
    console.debug("Class ID:", classId);

    if (!inviteEmail.trim()) {
      console.warn("Invite email is empty, aborting invite");
      return;
    }

    try {
      const payload = { email: inviteEmail, class_id: classId };
      console.debug("Sending payload:", payload);
      const res = await fetch("/api/invite-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.debug("Response status:", res.status);
      const result = await res.json();
      console.debug("Response body:", result);
      if (!res.ok) {
        alert("❌ Failed to invite: " + (result?.error || "Unknown error"));
      } else {
        alert("✅ Invitation sent!");
        setInviteEmail("");
        await refreshInvites(); // Refresh invites state after successful invite.
      }
    } catch (error) {
      console.error("❌ Error in handleInvite:", error);
      alert("❌ An error occurred during invitation.");
    }
  };

  // Bulk invite (mass upload) with debugging and refresh.
  const handleMassUpload = async (file: File, classId: string) => {
    console.debug("handleMassUpload invoked with file:", file.name, "and classId:", classId);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let emails: string[] = [];

    if (ext === "csv") {
      const text = await file.text();
      emails = text.split("\n").map((line) => line.trim()).filter(Boolean);
    } else if (ext === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json<{ email: string }>(sheet);
      emails = parsed.map((r) => r.email?.trim()).filter(Boolean) as string[];
    } else {
      alert("Only .csv or .xlsx files are supported");
      return;
    }
    console.debug("Emails extracted from file:", emails);

    if (!confirm(`Invite ${emails.length} students?`)) return;

    for (const email of emails) {
      console.debug("Inviting email:", email);
      await fetch("/api/invite-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, class_id: classId }),
      });
    }
    await refreshInvites(); // Refresh invites state after bulk invite.
    alert("✅ Bulk invite complete.");
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Class Management</h1>

        {/* Create New Class */}
        <div className="space-y-4 mb-12">
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Class Name</option>
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
              className="p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.full_name || i.email}
              </option>
            ))}
          </select>

          <select
            value={fellowshipName}
            onChange={(e) => setFellowshipName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Fellowship</option>
            <option value="Fellowship I">Fellowship I</option>
            <option value="Fellowship II">Fellowship II</option>
            <option value="Fellowship III">Fellowship III</option>
          </select>

          <button
            onClick={handleCreateClass}
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Creating..." : "Create Class"}
          </button>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </div>

        {/* Class List */}
        <div className="space-y-6">
          {classes.map((cls) => {
            const theme = getCurrentWeekTheme(cls.id, cls.start_date);
            return (
              <div
                key={cls.id}
                className="p-6 border rounded bg-white dark:bg-gray-900 shadow space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">{cls.name}</h2>
                    <p className="text-sm text-gray-500">
                      Instructor: {cls.instructor?.full_name || cls.instructor?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cls.start_date} → {cls.end_date}
                    </p>
                    {cls.fellowship_name && (
                      <p className="text-sm text-gray-500">
                        Fellowship: {cls.fellowship_name}
                      </p>
                    )}
                    {theme && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        📅 This Week's Theme: <span className="font-medium">{theme}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setEditingClass(cls)}
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleViewClass(cls)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Invite Section */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">📨 Invite Students</h3>
                  <div className="flex gap-2 mb-2 items-center">
                    <input
                      type="email"
                      value={selectedClass === cls.id ? inviteEmail : ""}
                      onChange={(e) => {
                        setInviteEmail(e.target.value);
                        setSelectedClass(cls.id);
                      }}
                      placeholder="student@email.com"
                      className="flex-1 p-2 border rounded dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => handleInvite(cls.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Invite
                    </button>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
                      Bulk Upload
                      <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMassUpload(file, cls.id);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Class Modal */}
        <Dialog
          open={!!viewingClass}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-xl rounded bg-white dark:bg-gray-900 p-6 shadow-xl">
              <Dialog.Title className="text-xl font-bold mb-4">
                👥 {viewingClass?.name} Members
              </Dialog.Title>
              <ul className="space-y-2 text-sm">
                {invites
                  .filter((inv) => inv.class_id === viewingClass?.id)
                  .map((inv) => (
                    <li key={inv.id} className="flex justify-between items-center">
                      <span>{inv.email}</span>
                      <button
                        onClick={() => handleDeleteStudent(inv.id)}
                        className="text-red-600 hover:text-red-400 text-xs"
                      >
                        ❌ Remove
                      </button>
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => {
                  setViewingClass(null);
                  setIsModalOpen(false);
                }}
                className="mt-6 bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Class Modal */}
        <Dialog
          open={!!editingClass}
          onClose={() => setEditingClass(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-xl rounded bg-white dark:bg-gray-900 p-6 shadow-xl space-y-4">
              <Dialog.Title className="text-xl font-bold mb-2">
                ✏️ Edit Class
              </Dialog.Title>

              <input
                value={editingClass?.name || ""}
                onChange={(e) =>
                  setEditingClass((prev) => prev && { ...prev, name: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                placeholder="Class Name"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={editingClass?.start_date || ""}
                  onChange={(e) =>
                    setEditingClass((prev) =>
                      prev && { ...prev, start_date: e.target.value }
                    )
                  }
                  className="p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="date"
                  value={editingClass?.end_date || ""}
                  onChange={(e) =>
                    setEditingClass((prev) =>
                      prev && { ...prev, end_date: e.target.value }
                    )
                  }
                  className="p-2 border rounded dark:bg-gray-800 dark:text-white"
                />
              </div>

              <select
                value={editingClass?.instructor_id || ""}
                onChange={(e) =>
                  setEditingClass((prev) =>
                    prev && { ...prev, instructor_id: e.target.value }
                  )
                }
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Instructor</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.full_name || i.email}
                  </option>
                ))}
              </select>

              <select
                value={editingClass?.fellowship_name || ""}
                onChange={(e) =>
                  setEditingClass((prev) =>
                    prev && { ...prev, fellowship_name: e.target.value }
                  )
                }
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Fellowship</option>
                <option value="Fellowship I">Fellowship I</option>
                <option value="Fellowship II">Fellowship II</option>
                <option value="Fellowship III">Fellowship III</option>
              </select>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setEditingClass(null)}
                  className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!editingClass) return;
                    const { error } = await supabase
                      .from("classes")
                      .update({
                        name: editingClass.name,
                        start_date: editingClass.start_date,
                        end_date: editingClass.end_date,
                        instructor_id: editingClass.instructor_id,
                        fellowship_name: editingClass.fellowship_name,
                      })
                      .eq("id", editingClass.id);

                    if (error) {
                      alert("❌ Failed to update class.");
                      console.error(error);
                      return;
                    }
                    // Refresh class list.
                    const { data: refreshed } = await supabase
                      .from("classes")
                      .select("*, instructor:instructor_id (id, full_name, email)")
                      .order("created_at", { ascending: false });

                    setClasses(refreshed || []);
                    setEditingClass(null);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
                >
                  Save Changes
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </BaseLayout>
  );
}
