"use client";

import { useState } from "react";

export default function CreateClassAndInvite() {
  const [classCreated, setClassCreated] = useState(false);
  const [className, setClassName] = useState("");
  const [numStudents, setNumStudents] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructor, setInstructor] = useState("");

  const [studentEmail, setStudentEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleCreateClass = () => {
    if (!className || !numStudents || !startDate || !endDate || !instructor) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Creating class:", {
      className,
      numStudents,
      startDate,
      endDate,
      instructor,
    });

    setClassCreated(true);
    alert("Class created! (Demo mode)");
  };

  const handleInvite = () => {
    if (!studentEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setInvitedEmails((prev) => [...prev, studentEmail]);
    setStudentEmail("");
    alert(`Invitation sent to ${studentEmail} (Demo mode)`);
  };

  return (
    <div className="space-y-10 mt-10">
      {/* Create New Class Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">📚 Create New Class</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Delta Flight 23-04"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Students</label>
            <input
              type="number"
              value={numStudents}
              onChange={(e) => setNumStudents(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
              placeholder="e.g. 22"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Assigned Instructor</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
              placeholder="e.g. MSgt Johnson"
            />
          </div>
        </div>
        <button
          onClick={handleCreateClass}
          className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create Class
        </button>
      </div>

      {/* Invite Students Section */}
      <div
        className={`${
          !classCreated ? "opacity-50 pointer-events-none" : ""
        } bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6`}
      >
        <h2 className="text-lg font-semibold mb-4">✉️ Invite Students to Class</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
            placeholder="Enter student email"
          />
          <button
            onClick={handleInvite}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Send Invite
          </button>
        </div>

        {invitedEmails.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Invited Emails:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {invitedEmails.map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
