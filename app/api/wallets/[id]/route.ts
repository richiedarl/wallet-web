import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to manage linked wallets.", 401);

  const { id } = await context.params;
  const result = db
    .prepare("DELETE FROM wallets WHERE id = ? AND user_id = ?")
    .run(id, user.id);
  if (result.changes !== 1) return jsonError("Linked wallet was not found.", 404);

  return jsonResponse({ ok: true });
}
