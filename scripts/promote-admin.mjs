import Database from "better-sqlite3";
import nextEnv from "@next/env";
import { mkdirSync } from "node:fs";
import path from "node:path";

nextEnv.loadEnvConfig(process.cwd());

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:promote -- user@example.com");
  process.exitCode = 1;
} else {
  const databasePath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(process.cwd(), "data", "nova.sqlite");
  mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);

  try {
    const result = db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(email);
    if (result.changes !== 1) {
      console.error(`No account found for ${email}. Register the account first.`);
      process.exitCode = 1;
    } else {
      console.log(`Admin access enabled for ${email}.`);
    }
  } finally {
    db.close();
  }
}
