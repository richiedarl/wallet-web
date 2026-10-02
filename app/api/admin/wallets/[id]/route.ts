import { NextRequest } from "next/server";
import { recordAdminAction } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const admin = await getCurrentUser();
  if (!admin) return jsonError("Sign in to continue.", 401);
  if (admin.role !== "admin") return jsonError("Admin access is required.", 403);

  const { id } = await context.params;
  const wallet = db
    .prepare("SELECT user_id AS userId FROM wallets WHERE id = ?")
    .get(id) as { userId: string } | undefined;
  if (!wallet) return jsonError("Linked wallet was not found.", 404);

  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM wallets WHERE id = ?").run(id);
    recordAdminAction(admin.id, "wallet_unlinked_by_admin", wallet.userId, id);
  });
  transaction();

  return jsonResponse({ ok: true });
}
