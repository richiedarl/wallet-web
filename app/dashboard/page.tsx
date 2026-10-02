import { redirect } from "next/navigation";
import { UserDashboard } from "@/components/account/UserDashboard";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  const wallets = db
    .prepare(
      `SELECT id, address, chain_id AS chainId, created_at AS createdAt
       FROM wallets WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(user.id) as { id: string; address: string; chainId: number; createdAt: number }[];

  return <UserDashboard user={{ email: user.email }} initialWallets={wallets} />;
}
