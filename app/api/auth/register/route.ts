import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import {
  createSession,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, isEmail, jsonError, jsonResponse, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const body = await readJson(request);
  const email = body?.email;
  const password = body?.password;

  if (!isEmail(email)) return jsonError("Enter a valid email address.", 400);
  if (typeof password !== "string" || password.length < 12 || password.length > 128) {
    return jsonError("Password must be between 12 and 128 characters.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare("SELECT 1 FROM users WHERE email = ?").get(normalizedEmail);
  if (existing) return jsonError("An account with this email already exists.", 409);

  const passwordHash = await hashPassword(password);
  const userId = randomUUID();
  const now = Date.now();

  try {
    db.prepare(
      "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
    ).run(userId, normalizedEmail, passwordHash, now);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: users.email")) {
      return jsonError("An account with this email already exists.", 409);
    }
    throw error;
  }

  const token = createSession(userId);
  await setSessionCookie(token);
  return jsonResponse({ ok: true, redirectTo: "/dashboard" }, 201);
}
