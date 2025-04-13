"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";

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
  const [userEmails, setUserEmails] = useState<string[]>([]);

  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");
  const [fellowshipName, setFellowshipName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const calculateCurrentWeekNumber = (start: string): number => {
    const startDate = new Date(start);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks + 1;
  };

  const getCurrentWeekTheme = (classId: string, start: string) => {
    const currentWeek = calculateCurrentWeekNumber(start);
    const match = classWeeks.find(
      (cw) => cw.class_id === classId && cw.week_number === currentWeek
    );
    return match?.theme || null;
  };

  const handleCreateClass = async () => {
    if (!className || !startDate || !endDate || !instructorId || !fellowshipName) {
      alert("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("classes").insert({
      name: className,
      start_date: startDate,
      end_date: endDate,
      instructor_id: instructorId,
      fellowship_name: fellowshipName,
    });

    if (error) {
      console.error("❌ Failed to create class:", error);
      setMessage(`❌ Failed to create class: ${error.message}`);
    } else {
      setMessage("✅ Class created successfully!");
      setClassName("");
      setStartDate("");
      setEndDate("");
      setInstructorId("");
      setFellowshipName("");

      const { data } = await supabase
        .from("classes")
        .select("*, instructor:instructor_id (id, full_name, email)")
        .order("created_at", { ascending: false });

      setClasses(data || []);
    }

    setSubmitting(false);
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const { error } = await supabase.from("classes").delete().eq("id", classId);
    if (error) {
      alert("❌ Failed to delete class.");
      console.error(error);
    } else {
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    }
  };

  const handleDeleteStudent = async (inviteId: string) => {
    if (!confirm("Remove this student from the class?")) return;
    const { error } = await supabase.from("class_students").delete().eq("id", inviteId);
    if (error) {
      alert("❌ Failed to remove student.");
      console.error(error);
    } else {
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    }
  };

  const handleViewClass = (cls: Class) => {
    setViewingClass(cls);
    setIsModalOpen(true);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Class Management</h1>

        {/* Add Class */}
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
              <option key={i.id} value={i.id}>{i.full_name || i.email}</option>
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
              <div key={cls.id} className="p-6 border rounded bg-white dark:bg-gray-900 shadow space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{cls.name}</h2>
                    <p className="text-sm text-gray-500">Instructor: {cls.instructor?.full_name || cls.instructor?.email}</p>
                    <p className="text-sm text-gray-500">{cls.start_date} → {cls.end_date}</p>
                    {cls.fellowship_name && (
                      <p className="text-sm text-gray-500">Fellowship: {cls.fellowship_name}</p>
                    )}
                    {theme && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        📅 This Week's Theme: <span className="font-medium">{theme}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewClass(cls)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">👁️ View</button>
                    <button onClick={() => handleDeleteClass(cls.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">🗑️ Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
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
