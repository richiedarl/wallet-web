import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "nova_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_HASH_BYTES = 64;
const SCRYPT_OPTIONS = { N: 1 << 14, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function derivePasswordHash(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(password, salt, PASSWORD_HASH_BYTES, SCRYPT_OPTIONS, (error, derived) => {
      if (error) {
        reject(error);
      } else {
        resolve(derived);
      }
    });
  });
}

export type User = {
  id: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: number;
};

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await derivePasswordHash(password, salt);
  return `scrypt$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, saltText, hashText] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;

  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  if (expected.length !== PASSWORD_HASH_BYTES) return false;

  const actual = await derivePasswordHash(password, salt);
  return timingSafeEqual(expected, actual);
}

export function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();

  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
  db.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).run(hashSessionToken(token), userId, now + SESSION_MAX_AGE_SECONDS * 1000, now);

  return token;
}

export function deleteSession(token: string) {
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashSessionToken(token));
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT users.id, users.email, users.role, users.status, users.created_at AS createdAt
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
    )
    .get(hashSessionToken(token), Date.now()) as User | undefined;

  if (!row || row.status !== "active") return null;
  return row;
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export function hashNonce(nonce: string) {
  return hashSessionToken(nonce);
}
