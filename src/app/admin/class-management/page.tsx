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

interface Class {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  instructor_id: string;
  instructor?: Instructor;
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
  const [invites, setInvites] = useState<StudentInvite[]>([]);

  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [inst, templates, cls, invitesRes] = await Promise.all([
        supabase.from("instructors").select("*"),
        supabase.from("class_templates").select("*"),
        supabase.from("classes")
          .select("*, instructor:instructor_id (id, full_name, email)")
          .order("created_at", { ascending: false }),
        supabase.from("class_students").select("*"),
      ]);

      if (inst.data) setInstructors(inst.data);
      if (templates.data) setClassTemplates(templates.data);
      if (cls.data) setClasses(cls.data);
      if (invitesRes.data) setInvites(invitesRes.data);
    };

    fetchData();
  }, []);

  const handleCreateClass = async () => {
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
      const { data } = await supabase
        .from("classes")
        .select("*, instructor:instructor_id (id, full_name, email)")
        .order("created_at", { ascending: false });
      setClasses(data || []);
    }

    setSubmitting(false);
  };

  const handleInvite = async (classId: string) => {
    if (!inviteEmail.trim()) return;

    const response = await fetch("/api/invite-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, class_id: classId }),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Invitation sent!");
      setInviteEmail("");
      const { data } = await supabase.from("class_students").select("*");
      setInvites(data || []);
    } else {
      alert("❌ Failed to invite student.");
    }
  };

  const handleMassUpload = async (file: File, classId: string) => {
    const text = await file.text();
    const emails = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const confirmed = confirm(`Invite ${emails.length} students to this class?`);
    if (!confirmed) return;

    for (const email of emails) {
      await fetch("/api/invite-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, class_id: classId }),
      });
    }

    alert(`✅ Invited ${emails.length} students.`);
    const { data } = await supabase.from("class_students").select("*");
    setInvites(data || []);
  };

  const handleDeleteClass = async (classId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this class?");
    if (!confirmDelete) return;

    await supabase.from("classes").delete().eq("id", classId);
    const { data } = await supabase
      .from("classes")
      .select("*, instructor:instructor_id (id, full_name, email)")
      .order("created_at", { ascending: false });
    setClasses(data || []);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Class Management</h1>

        {/* Create Class Form */}
        <div className="space-y-4 mb-12">
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
          >
            <option value="" disabled>Select Class Name</option>
            {classTemplates.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
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
            <option value="" disabled>Select Instructor</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.full_name || inst.email}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateClass}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium"
          >
            {submitting ? "Creating..." : "Create Class"}
          </button>

          {message && <p className="text-sm mt-2">{message}</p>}
        </div>

        {/* List of Existing Classes */}
        <div className="space-y-6">
          {classes.map((cls) => (
            <div key={cls.id} className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{cls.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Instructor: {cls.instructor?.full_name || cls.instructor?.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cls.start_date} → {cls.end_date}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="text-red-500 text-sm hover:text-red-400"
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Invite Students */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">📨 Invite Students</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={selectedClass === cls.id ? inviteEmail : ""}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      setSelectedClass(cls.id);
                    }}
                    placeholder="student@email.com"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
                  />
                  <button
                    onClick={() => handleInvite(cls.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Invite
                  </button>
                </div>

                {/* Mass Upload */}
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleMassUpload(file, cls.id);
                  }}
                  className="mt-2 text-sm"
                />

                {/* Invited student list */}
                <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {invites
                    .filter((inv) => inv.class_id === cls.id)
                    .map((inv) => (
                      <li key={inv.id}>👤 {inv.email}</li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}