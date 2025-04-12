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
  first_name: string;
  last_name: string;
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { data: student, error } = await supabase
    .from("students")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  if (!student || !student.first_name) {
    redirect("/complete-profile");
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
