// src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClientDashboard from "./client-dashboard";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch the student record from Supabase using Clerk's user ID.
  const { data: student, error } = await supabase
    .from("students")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  console.log("Student record:", student, error);

  // If the student's profile is incomplete, redirect to complete-profile.
  if (!student || !student.first_name) {
    redirect("/complete-profile");
  }

  // Convert the student record to a plain object.
  const plainStudent = JSON.parse(JSON.stringify(student));

  // Create a plain object for the Clerk user.
  const plainUser = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses?.[0]?.emailAddress || "",
  };

  return <ClientDashboard user={plainUser} student={plainStudent} />;
}
