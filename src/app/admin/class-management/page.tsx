"use client";

import { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
import { clerkClient } from "@clerk/clerk-sdk-node";
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
  const [classWeeks, setClassWeeks] = useState<ClassWeek[]>([]);
  const [userEmails, setUserEmails] = useState<string[]>([]);

  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructorId, setInstructorId] = useState<string>("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleViewClass = (cls: Class) => {
    setViewingClass(cls);
    setIsModalOpen(true);
  };

  return (
    <BaseLayout isAdmin showBackToDashboard>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📚 Class Management</h1>

        {/* Class Cards */}
        <div className="space-y-6">
          {classes.map((cls) => {
            const theme = getCurrentWeekTheme(cls.id, cls.start_date);
            return (
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
                    {theme && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        📅 This Week's Theme: <span className="font-medium">{theme}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewClass(cls)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      👁️ View Class
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                      <span>{inv.email}</span>
                      <span
                        className={`text-xs font-medium ${
                          userEmails.includes(inv.email.toLowerCase())
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {userEmails.includes(inv.email.toLowerCase())
                          ? "Signed Up"
                          : "Pending"}
                      </span>
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
