import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClientDashboard from "./client-dashboard";
import BaseLayout from "@/components/BaseLayout";

interface UserProps {
  id: string;
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
  class_id: string; // ✅ Ensure class_id is required
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { data: student, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching student profile:", error);
  }

  if (!student || !student.first_name || !student.class_id) {
    redirect("/profile-setup");
  }

  const plainStudent: StudentProps = {
    ...student,
    class_id: student.class_id
  };

  const plainUser: UserProps = {
    id: user.id,
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
