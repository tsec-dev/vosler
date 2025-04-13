import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClientDashboard from "./client-dashboard";
import BaseLayout from "@/components/BaseLayout";

// Type interfaces
interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

interface StudentProps {
  // Ensure to include all fields you need (this should match your view)
  first_name: string;
  last_name: string;
  military_name?: string;
  rank?: string;
  // You can include other fields if you need them:
  branch?: string;
  years_of_service?: string;
  current_duty?: string;
  class_id?: string;
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch the full student profile from the view student_profiles.
  // This view should return columns: first_name, last_name, military_name, rank, etc.
  const { data: student, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching student profile:", error);
  }

  // If no student profile or first_name is missing, redirect to the profile completion page.
  if (!student || !student.first_name) {
    redirect("/complete-profile");
  }

  // Map the fetched student data into plainStudent with the extra MIL fields.
  const plainStudent: StudentProps = student;

  const plainUser: UserProps = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses?.[0]?.emailAddress || "",
    isAdmin: user.publicMetadata?.role === "admin",
  };

  return (
    <BaseLayout isAdmin={plainUser.isAdmin}>
      <ClientDashboard user={plainUser} student={plainStudent} />
    </BaseLayout>
  );
}
