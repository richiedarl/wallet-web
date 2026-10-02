import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export function createWalletChallenge(userId: string, address: string, chainId: number) {
  const nonce = randomBytes(32).toString("hex");
  const issuedAt = new Date();
  const message = [
    "NOVA wallet address verification",
    "",
    `Address: ${address}`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued at: ${issuedAt.toISOString()}`,
    "",
    "This signature only proves control of this address. It does not authorize a transaction.",
  ].join("\n");

  db.prepare("DELETE FROM wallet_challenges WHERE expires_at <= ? OR used_at IS NOT NULL").run(
    Date.now(),
  );
  db.prepare(
    `INSERT INTO wallet_challenges
      (nonce_hash, user_id, address, chain_id, message, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    createHash("sha256").update(nonce).digest("hex"),
    userId,
    address.toLowerCase(),
    chainId,
    message,
    Date.now() + 5 * 60 * 1000,
  );

  return { nonce, message };
}
