"use client";

import BaseLayout from "@/components/BaseLayout";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  return (
    <BaseLayout isAdmin showBackToDashboard>
      <AdminPanel />
    </BaseLayout>
  );
}
