import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminDashboardData } from "@/lib/admin-data";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <AdminDashboard admin={{ email: user.email }} initialData={getAdminDashboardData()} />;
}
