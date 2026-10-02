import { getCurrentUser } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin) return jsonError("Sign in to continue.", 401);
  if (admin.role !== "admin") return jsonError("Admin access is required.", 403);

  return jsonResponse(getAdminDashboardData());
}
