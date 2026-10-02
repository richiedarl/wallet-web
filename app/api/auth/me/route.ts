import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to continue.", 401);

  return jsonResponse({ user });
}
