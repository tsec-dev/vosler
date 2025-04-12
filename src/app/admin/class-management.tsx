"use client";

import BaseLayout from "@/components/BaseLayout";
import { useState } from "react";

export default function ClassManagement() {
  // Control whether to show the student invitation step after class creation.
  const [showStudentInvitation, setShowStudentInvitation] = useState(false);

  const handleClassCreated = () => {
    setShowStudentInvitation(true);
  };

  return (
    <BaseLayout showBackToDashboard isAdmin>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Class Management</h1>
        {!showStudentInvitation ? (
          <ClassCreation onComplete={handleClassCreated} />
        ) : (
          <StudentInvitation
            onComplete={() =>
              alert("Students invited. Ready to use class data via SQL.")
            }
          />
        )}
      </div>
    </BaseLayout>
  );
}

// Component for creating the class
function ClassCreation({ onComplete }: { onComplete: () => void }) {
  const [className, setClassName] = useState("");
  const [numStudents, setNumStudents] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructor, setInstructor] = useState("");

  const handleCreateClass = () => {
    if (!className || !numStudents || !startDate || !endDate || !instructor) {
      alert("Please fill out all fields.");
      return;
    }
    // Later: send data to the backend to create a class in SQL
    onComplete();
  };

  return (
    <div className="bg-white dark:bg-gray-900 border rounded p-6 shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Your Class</h2>
      <input
        type="text"
        placeholder="Class Name"
        className="w-full p-2 border rounded mb-2"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Students"
        className="w-full p-2 border rounded mb-2"
        value={numStudents}
        onChange={(e) => setNumStudents(Number(e.target.value))}
      />
      <input
        type="date"
        className="w-full p-2 border rounded mb-2"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 border rounded mb-2"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Instructor Name"
        className="w-full p-2 border rounded mb-4"
        value={instructor}
        onChange={(e) => setInstructor(e.target.value)}
      />
      <button onClick={handleCreateClass} className="w-full bg-indigo-600 text-white p-2 rounded">
        Create Class
      </button>
    </div>
  );
}

// Component for inviting students
function StudentInvitation({ onComplete }: { onComplete: () => void }) {
  const [studentEmail, setStudentEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleInvite = () => {
    if (!studentEmail.includes("@")) {
      alert("Enter a valid email.");
      return;
    }
    setInvitedEmails([...invitedEmails, studentEmail]);
    setStudentEmail("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 border rounded p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Invite Students</h2>
      <input
        type="email"
        placeholder="Student Email"
        className="w-full p-2 border rounded mb-2"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
      />
      <button onClick={handleInvite} className="bg-blue-600 text-white p-2 rounded mb-4">
        Invite Student
      </button>
      <div className="mb-4">
        <h3 className="font-semibold">Invited Emails:</h3>
        <ul>
          {invitedEmails.map((email, idx) => (
            <li key={idx} className="text-sm">
              {email}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onComplete} className="w-full bg-green-600 text-white p-2 rounded">
        Save and Finish
      </button>
    </div>
  );
}
