import { randomUUID } from "node:crypto";
import { createPublicClient, http, recoverMessageAddress } from "viem";
import { arbitrum, base, mainnet, optimism, type Chain } from "viem/chains";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidOrigin, jsonError, jsonResponse, readJson } from "@/lib/http";
import { hashNonce } from "@/lib/auth";

export const runtime = "nodejs";

const supportedChains: Chain[] = [mainnet, optimism, arbitrum, base];

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to link a wallet.", 401);

  const body = await readJson(request);
  if (
    typeof body?.nonce !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.nonce) ||
    typeof body.signature !== "string" ||
    !/^0x(?:[a-fA-F0-9]{2})+$/.test(body.signature) ||
    body.signature.length > 20_000
  ) {
    return jsonError("Wallet verification details are invalid.", 400);
  }

  const challenge = db
    .prepare(
      `SELECT address, chain_id AS chainId, message
       FROM wallet_challenges
       WHERE nonce_hash = ? AND user_id = ? AND used_at IS NULL AND expires_at > ?`,
    )
    .get(hashNonce(body.nonce), user.id, Date.now()) as
    | { address: string; chainId: number; message: string }
    | undefined;

  if (!challenge) return jsonError("Wallet verification expired. Please try again.", 400);

  let verified = false;
  try {
    const recoveredAddress = await recoverMessageAddress({
      message: challenge.message,
      signature: body.signature as `0x${string}`,
    });
    verified = recoveredAddress.toLowerCase() === challenge.address;
  } catch {
    verified = false;
  }

  if (!verified) {
    const chain = supportedChains.find((item) => item.id === challenge.chainId);
    const rpcUrl = chain?.rpcUrls.default.http[0];
    if (!rpcUrl) return jsonError("This network is not supported for wallet verification.", 400);

    try {
      const client = createPublicClient({ transport: http(rpcUrl) });
      verified = await client.verifyMessage({
        address: challenge.address as `0x${string}`,
        message: challenge.message,
        signature: body.signature as `0x${string}`,
      });
    } catch {
      return jsonError("Wallet verification could not reach the selected network. Please retry.", 503);
    }
  }
  if (!verified) return jsonError("Wallet signature could not be verified.", 400);

  const now = Date.now();
  const addWallet = db.transaction(() => {
    const consumed = db
      .prepare(
        `UPDATE wallet_challenges SET used_at = ?
         WHERE nonce_hash = ? AND user_id = ? AND used_at IS NULL AND expires_at > ?`,
      )
      .run(now, hashNonce(body.nonce as string), user.id, now);
    if (consumed.changes !== 1) return false;

    db.prepare(
      `INSERT INTO wallets (id, user_id, address, chain_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(randomUUID(), user.id, challenge.address, challenge.chainId, now);
    return true;
  });

  try {
    if (!addWallet()) return jsonError("Wallet verification expired. Please try again.", 400);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: wallets.address")) {
      return jsonError("This wallet address is already linked to an account.", 409);
    }
    throw error;
  }

  return jsonResponse({ ok: true });
}
