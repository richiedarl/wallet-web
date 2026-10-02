import "server-only";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

export function recordAdminAction(
  adminUserId: string,
  action: string,
  targetUserId: string | null,
  targetWalletId: string | null = null,
) {
  db.prepare(
    `INSERT INTO admin_audit_log
      (id, admin_user_id, action, target_user_id, target_wallet_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(randomUUID(), adminUserId, action, targetUserId, targetWalletId, Date.now());
}
