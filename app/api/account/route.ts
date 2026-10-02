import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  clearSessionCookie,
  deleteSession,
  getCurrentUser,
  hashPassword,
  hashSessionToken,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, jsonError, jsonResponse, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to continue.", 401);

  const body = await readJson(request);
  if (
    typeof body?.currentPassword !== "string" ||
    typeof body.newPassword !== "string" ||
    body.newPassword.length < 12 ||
    body.newPassword.length > 128
  ) {
    return jsonError("Enter your current password and a new password of at least 12 characters.", 400);
  }

  const account = db
    .prepare("SELECT password_hash AS passwordHash FROM users WHERE id = ?")
    .get(user.id) as { passwordHash: string } | undefined;
  if (!account || !(await verifyPassword(body.currentPassword, account.passwordHash))) {
    return jsonError("Current password is incorrect.", 400);
  }

  const nextHash = await hashPassword(body.newPassword);
  const cookieToken = (await cookies()).get(SESSION_COOKIE)?.value;
  db.transaction(() => {
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(nextHash, user.id);
    if (cookieToken) {
      db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").run(
        user.id,
        hashSessionToken(cookieToken),
      );
    }
  })();

  return jsonResponse({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to continue.", 401);
  if (user.role !== "user") return jsonError("Admin accounts cannot be deleted here.", 403);

  const body = await readJson(request);
  if (typeof body?.password !== "string") return jsonError("Enter your password to delete your account.", 400);

  const account = db
    .prepare("SELECT password_hash AS passwordHash FROM users WHERE id = ?")
    .get(user.id) as { passwordHash: string } | undefined;
  if (!account || !(await verifyPassword(body.password, account.passwordHash))) {
    return jsonError("Password is incorrect.", 400);
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  if (token) deleteSession(token);
  await clearSessionCookie();
  return jsonResponse({ ok: true, redirectTo: "/" });
}
