import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

type GlobalWithDatabase = typeof globalThis & {
  novaDatabase?: Database.Database;
};

function createDatabase() {
  const databasePath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(process.cwd(), "data", "nova.sqlite");

  mkdirSync(path.dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_at ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS wallet_challenges (
      nonce_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      address TEXT NOT NULL,
      chain_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS wallet_challenges_user_id ON wallet_challenges(user_id);

    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      address TEXT NOT NULL,
      chain_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(address, chain_id)
    );
    CREATE INDEX IF NOT EXISTS wallets_user_id ON wallets(user_id);

    CREATE TABLE IF NOT EXISTS login_attempts (
      email TEXT PRIMARY KEY COLLATE NOCASE,
      count INTEGER NOT NULL,
      window_started_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id TEXT PRIMARY KEY,
      admin_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      action TEXT NOT NULL,
      target_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      target_wallet_id TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_audit_created_at ON admin_audit_log(created_at);
  `);

  return database;
}

const globalDatabase = globalThis as GlobalWithDatabase;

export const db = globalDatabase.novaDatabase ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalDatabase.novaDatabase = db;
}
