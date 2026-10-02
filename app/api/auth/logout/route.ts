import { cookies } from "next/headers";
import { deleteSession, SESSION_COOKIE, clearSessionCookie } from "@/lib/auth";
import { NextRequest } from "next/server";
import { hasValidOrigin, jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);
  await clearSessionCookie();
  return jsonResponse({ ok: true });
}
