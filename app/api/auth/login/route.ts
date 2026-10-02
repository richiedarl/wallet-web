import { NextRequest } from "next/server";
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, isEmail, jsonError, jsonResponse, readJson } from "@/lib/http";

export const runtime = "nodejs";

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function recordFailure(email: string) {
  const now = Date.now();
  const transaction = db.transaction(() => {
    const row = db
      .prepare("SELECT count, window_started_at AS windowStartedAt FROM login_attempts WHERE email = ?")
      .get(email) as { count: number; windowStartedAt: number } | undefined;

    if (!row || now - row.windowStartedAt >= ATTEMPT_WINDOW_MS) {
      db.prepare(
        `INSERT INTO login_attempts (email, count, window_started_at) VALUES (?, 1, ?)
         ON CONFLICT(email) DO UPDATE SET count = 1, window_started_at = excluded.window_started_at`,
      ).run(email, now);
      return 1;
    }

    const count = row.count + 1;
    db.prepare("UPDATE login_attempts SET count = ? WHERE email = ?").run(count, email);
    return count;
  });

  return transaction();
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const body = await readJson(request);
  if (!isEmail(body?.email) || typeof body?.password !== "string") {
    return jsonError("Email or password is incorrect.", 401);
  }

  const email = body.email.trim().toLowerCase();
  const now = Date.now();
  const attempt = db
    .prepare("SELECT count, window_started_at AS windowStartedAt FROM login_attempts WHERE email = ?")
    .get(email) as { count: number; windowStartedAt: number } | undefined;
  if (attempt && now - attempt.windowStartedAt < ATTEMPT_WINDOW_MS && attempt.count >= MAX_ATTEMPTS) {
    return jsonError("Too many sign-in attempts. Please try again in 15 minutes.", 429);
  }

  const user = db
    .prepare("SELECT id, password_hash AS passwordHash, status, role FROM users WHERE email = ?")
    .get(email) as
    | { id: string; passwordHash: string; status: string; role: "user" | "admin" }
    | undefined;

  if (!user || user.status !== "active" || !(await verifyPassword(body.password, user.passwordHash))) {
    recordFailure(email);
    return jsonError("Email or password is incorrect.", 401);
  }

  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(email);
  const token = createSession(user.id);
  await setSessionCookie(token);
  return jsonResponse({ ok: true, redirectTo: user.role === "admin" ? "/admin" : "/dashboard" });
}
