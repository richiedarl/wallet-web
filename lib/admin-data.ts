import "server-only";

import { db } from "@/lib/db";

export type AdminWallet = {
  id: string;
  address: string;
  chainId: number;
  createdAt: number;
};

export type AdminAccount = {
  id: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: number;
  wallets: AdminWallet[];
};

export type AuditEvent = {
  action: string;
  targetUserId: string | null;
  targetWalletId: string | null;
  createdAt: number;
  adminEmail: string;
};

export function getAdminDashboardData() {
  const rows = db
    .prepare(
      `SELECT
         users.id,
         users.email,
         users.role,
         users.status,
         users.created_at AS createdAt,
         wallets.id AS walletId,
         wallets.address,
         wallets.chain_id AS chainId,
         wallets.created_at AS walletCreatedAt
       FROM users
       LEFT JOIN wallets ON wallets.user_id = users.id
       ORDER BY users.created_at DESC
       LIMIT 1000`,
    )
    .all() as {
    id: string;
    email: string;
    role: "user" | "admin";
    status: "active" | "suspended";
    createdAt: number;
    walletId: string | null;
    address: string | null;
    chainId: number | null;
    walletCreatedAt: number | null;
  }[];

  const byId = new Map<string, AdminAccount>();
  for (const row of rows) {
    let user = byId.get(row.id);
    if (!user) {
      user = {
        id: row.id,
        email: row.email,
        role: row.role,
        status: row.status,
        createdAt: row.createdAt,
        wallets: [],
      };
      byId.set(row.id, user);
    }
    if (row.walletId && row.address && row.chainId !== null && row.walletCreatedAt !== null) {
      user.wallets.push({
        id: row.walletId,
        address: row.address,
        chainId: row.chainId,
        createdAt: row.walletCreatedAt,
      });
    }
  }

  const activity = db
    .prepare(
      `SELECT admin_audit_log.action, admin_audit_log.target_user_id AS targetUserId,
              admin_audit_log.target_wallet_id AS targetWalletId,
              admin_audit_log.created_at AS createdAt, users.email AS adminEmail
       FROM admin_audit_log
       JOIN users ON users.id = admin_audit_log.admin_user_id
       ORDER BY admin_audit_log.created_at DESC
       LIMIT 50`,
    )
    .all() as AuditEvent[];

  return { users: [...byId.values()], activity };
}
