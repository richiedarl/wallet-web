import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { jsonError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to view your linked wallets.", 401);

  const wallets = db
    .prepare(
      `SELECT id, address, chain_id AS chainId, created_at AS createdAt
       FROM wallets WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(user.id);

  return jsonResponse({ wallets });
}
