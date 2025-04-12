"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Define the props interfaces and export them so they can be imported elsewhere.
export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export interface StudentProps {
  first_name: string;
  last_name: string;
}

export interface DashboardProps {
  user: UserProps;
  student: StudentProps;
  week?: number;
}

function capitalizeFirstName(name?: string): string {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const traits = ["Communication", "Leadership", "EQ", "Adaptability", "Integrity", "Boldness"];
const weekThemes = ["Architect", "Foundation", "Reflection", "Execution"];

const fakeBarData = [
  { trait: "Communication", self: 4, peer: 3 },
  { trait: "Leadership", self: 5, peer: 4 },
  { trait: "EQ", self: 3, peer: 4 },
  { trait: "Adaptability", self: 4, peer: 3 },
  { trait: "Integrity", self: 5, peer: 5 },
  { trait: "Boldness", self: 2, peer: 3 },
];

export default function ClientDashboard({ user, student, week = 2 }: DashboardProps): JSX.Element {
  const displayName = capitalizeFirstName(student.first_name || user.firstName);
  const weekTheme = weekThemes[week - 1] || "Growth";

  // (Your actual dashboard UI goes here)
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {displayName}, to Week {week}: {weekTheme}</h1>
      {/* Additional dashboard content */}
    </div>
  );
}
