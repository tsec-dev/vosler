"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
import { clerkClient } from "@clerk/clerk-sdk-node";

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
  const [userEmails, setUserEmails] = useState<string[]>([]);

  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [inst, templates, cls, invitesRes] = await Promise.all([
        supabase.from("instructors").select("*"),
        supabase.from("class_templates").select("*"),
        supabase
          .from("classes")
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

  useEffect(() => {
    const fetchClerkUsers = async () => {
      try {
        const users = await clerkClient.users.getUserList();
        const emails = users.flatMap((u) =>
          u.emailAddresses.map((e) => e.emailAddress.toLowerCase())
        );
        setUserEmails(emails);
      } catch (err) {
        console.error("Failed to fetch Clerk users", err);
      }
    };
    fetchClerkUsers();
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

    try {
      const response = await fetch("/api/invite-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, class_id: classId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ Invitation sent!");
        setInviteEmail("");
        const { data } = await supabase.from("class_students").select("*");
        setInvites(data || []);
      } else {
        console.error("❌ Invite failed:", result);
        alert("❌ Failed to invite student: " + (result?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("🚨 Invite request error:", err);
      alert("❌ An unexpected error occurred while inviting.");
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

    const { error } = await supabase.from("classes").delete().eq("id", classId);
    if (error) {
      alert("❌ Failed to delete class.");
      console.error(error);
      return;
    }

    const { data } = await supabase
      .from("classes")
      .select("*, instructor:instructor_id (id, full_name, email)")
      .order("created_at", { ascending: false });
    setClasses(data || []);
    setInvites((prev) => prev.filter((i) => i.class_id !== classId));
  };

  const handleDeleteStudent = async (inviteId: string) => {
    const confirmRemove = confirm("Remove this student from the class?");
    if (!confirmRemove) return;

    const { error } = await supabase.from("class_students").delete().eq("id", inviteId);
    if (error) {
      alert("❌ Failed to remove student.");
      console.error(error);
      return;
    }

    const { data } = await supabase.from("class_students").select("*");
    setInvites(data || []);
  };

  const handleViewClass = (cls: Class) => {
    setViewingClass(cls);
    setIsModalOpen(true);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Class Management</h1>

        {/* Class Creation Form */}
        <div className="space-y-4 mb-12">
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
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
            <option value="" disabled>Select Instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.full_name || i.email}
              </option>
            ))}
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
          {classes.map((cls) => (
            <div key={cls.id} className="p-6 border rounded bg-white dark:bg-gray-900 shadow space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{cls.name}</h2>
                  <p className="text-sm text-gray-500">
                    Instructor: {cls.instructor?.full_name || cls.instructor?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cls.start_date} → {cls.end_date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <label className="text-sm bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer">
                    📁 Mass Invite
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMassUpload(file, cls.id);
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleViewClass(cls)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    👁️ View Class
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Single Invite */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">📨 Invite Students</h3>
                <div className="flex gap-2 mb-2">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Class Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
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
                      <div>
                        <span>{inv.email}</span>
                        <span className={`ml-3 text-xs font-medium ${userEmails.includes(inv.email.toLowerCase()) ? "text-green-600" : "text-yellow-500"}`}>
                          {userEmails.includes(inv.email.toLowerCase()) ? "Signed Up" : "Pending"}
                        </span>
                      </div>
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
                onClick={() => setIsModalOpen(false)}
                className="mt-6 bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </BaseLayout>
  );
}
