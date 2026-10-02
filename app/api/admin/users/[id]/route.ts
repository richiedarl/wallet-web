import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordAdminAction } from "@/lib/admin";
import { db } from "@/lib/db";
import { hasValidOrigin, jsonError, jsonResponse, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const admin = await getCurrentUser();
  if (!admin) return jsonError("Sign in to continue.", 401);
  if (admin.role !== "admin") return jsonError("Admin access is required.", 403);

  const { id } = await context.params;
  if (id === admin.id) return jsonError("You cannot suspend your own admin account.", 400);
  const body = await readJson(request);
  if (body?.status !== "active" && body?.status !== "suspended") {
    return jsonError("Choose a valid account status.", 400);
  }

  const user = db
    .prepare("SELECT status FROM users WHERE id = ? AND role = 'user'")
    .get(id) as { status: string } | undefined;
  if (!user) return jsonError("User account was not found.", 404);

  const transaction = db.transaction(() => {
    db.prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'user'").run(body.status, id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(id);
    db.prepare("DELETE FROM wallet_challenges WHERE user_id = ?").run(id);
    recordAdminAction(admin.id, `user_${body.status}`, id);
  });
  transaction();

  return jsonResponse({ ok: true, status: body.status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const admin = await getCurrentUser();
  if (!admin) return jsonError("Sign in to continue.", 401);
  if (admin.role !== "admin") return jsonError("Admin access is required.", 403);

  const { id } = await context.params;
  if (id === admin.id) return jsonError("You cannot delete your own admin account.", 400);

  const exists = db.prepare("SELECT 1 FROM users WHERE id = ? AND role = 'user'").get(id);
  if (!exists) return jsonError("User account was not found.", 404);

  const transaction = db.transaction(() => {
    db.prepare(
      `INSERT INTO admin_audit_log
        (id, admin_user_id, action, target_user_id, created_at)
       VALUES (?, ?, 'user_deleted', ?, ?)`,
    ).run(randomUUID(), admin.id, id, Date.now());
    db.prepare("DELETE FROM users WHERE id = ? AND role = 'user'").run(id);
  });
  transaction();

  return jsonResponse({ ok: true });
}
