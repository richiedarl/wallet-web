import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createWalletChallenge } from "@/lib/wallet-challenges";
import { hasValidOrigin, jsonError, jsonResponse, readJson } from "@/lib/http";

export const runtime = "nodejs";

const supportedChains = new Set([1, 10, 42161, 8453]);
const addressPattern = /^0x[a-fA-F0-9]{40}$/;

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to link a wallet.", 401);

  const body = await readJson(request);
  if (
    typeof body?.address !== "string" ||
    !addressPattern.test(body.address) ||
    typeof body.chainId !== "number" ||
    !Number.isInteger(body.chainId) ||
    !supportedChains.has(body.chainId)
  ) {
    return jsonError("Choose a supported EVM wallet.", 400);
  }

  return jsonResponse(createWalletChallenge(user.id, body.address, body.chainId));
}
