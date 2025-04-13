import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClientDashboard from "./client-dashboard";
import BaseLayout from "@/components/BaseLayout";

// Extended type to include MIL fields
interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

interface StudentProps {
  first_name: string;
  last_name: string;
  military_name?: string;
  rank?: string;
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

  // Fetch the complete student profile from your view which has MIL data.
  const { data: student, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching student profile:", error);
  }

  if (!student || !student.first_name) {
    redirect("/profile-setup");
  }

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
