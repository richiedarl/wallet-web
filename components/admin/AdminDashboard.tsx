"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Ban, Check, LogOut, ShieldCheck, Trash2, Users, Wallet } from "lucide-react";

type AdminWallet = {
  id: string;
  address: string;
  chainId: number;
  createdAt: number;
};

type AdminUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: number;
  wallets: AdminWallet[];
};

type AuditEvent = {
  action: string;
  targetUserId: string | null;
  targetWalletId: string | null;
  createdAt: number;
  adminEmail: string;
};

const chains: Record<number, string> = {
  1: "Ethereum",
  10: "Optimism",
  42161: "Arbitrum",
  8453: "Base",
};

export function AdminDashboard({
  admin,
  initialData,
}: {
  admin: { email: string };
  initialData: { users: AdminUser[]; activity: AuditEvent[] };
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialData.users);
  const [activity, setActivity] = useState(initialData.activity);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadData() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const result = (await response.json()) as {
      users?: AdminUser[];
      activity?: AuditEvent[];
      error?: string;
    };
    if (!response.ok) throw new Error(result.error ?? "Could not load admin data.");
    setUsers(result.users ?? []);
    setActivity(result.activity ?? []);
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setError("Could not sign out. Please retry.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not reach the server to sign out. Please retry.");
    }
  }

  async function setStatus(user: AdminUser) {
    const status = user.status === "active" ? "suspended" : "active";
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not update account status.");
        return;
      }
      setError("");
      setNotice(`${user.email} is now ${status}.`);
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update account status.");
    }
  }

  async function unlinkWallet(user: AdminUser, wallet: AdminWallet) {
    if (!window.confirm(`Remove ${wallet.address} from ${user.email}'s NOVA account?`)) return;
    try {
      const response = await fetch(`/api/admin/wallets/${wallet.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not unlink wallet.");
        return;
      }
      setError("");
      setNotice("Wallet link removed. This does not affect assets or the wallet itself.");
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not unlink wallet.");
    }
  }

  async function deleteUser(user: AdminUser) {
    if (!window.confirm(`Permanently delete ${user.email}'s NOVA account and linked address records?`)) return;
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not delete user.");
        return;
      }
      setError("");
      setNotice(`Account ${user.email} deleted.`);
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete user.");
    }
  }

  const customers = users.filter((user) => user.role === "user");
  const activeAccounts = customers.filter((user) => user.status === "active").length;
  const walletCount = customers.reduce((count, user) => count + user.wallets.length, 0);

  return (
    <main className="account-page dashboard-page">
      <div className="dashboard-wrap admin-wrap">
        <header className="dashboard-header">
          <div>
            <Link className="dashboard-back" href="/">
              <ArrowLeft aria-hidden="true" /> Back to NOVA
            </Link>
            <span className="eyebrow dashboard-eyebrow"><span className="eyebrow-dot" /> Administration</span>
            <h1>Admin dashboard</h1>
            <p>{admin.email} · User and linked-address management</p>
          </div>
          <button className="button dashboard-logout" onClick={logout} type="button">
            <LogOut aria-hidden="true" /> Sign out
          </button>
        </header>

        {notice ? <p className="dashboard-notice" role="status"><Check aria-hidden="true" /> {notice}</p> : null}
        {error ? <p className="dashboard-error" role="alert">{error}</p> : null}

        <div className="admin-metrics">
          <article className="admin-metric">
            <Users aria-hidden="true" />
            <span>Customer accounts</span>
            <strong>{customers.length}</strong>
          </article>
          <article className="admin-metric">
            <ShieldCheck aria-hidden="true" />
            <span>Active accounts</span>
            <strong>{activeAccounts}</strong>
          </article>
          <article className="admin-metric">
            <Wallet aria-hidden="true" />
            <span>Linked addresses</span>
            <strong>{walletCount}</strong>
          </article>
        </div>

        <section className="dashboard-card" aria-labelledby="admin-users-title">
          <div className="dashboard-card-heading compact">
            <div className="dashboard-card-icon"><Users aria-hidden="true" /></div>
            <div>
              <h2 id="admin-users-title">Customer accounts</h2>
              <p>Manage account access and unlink publicly visible wallet addresses.</p>
            </div>
          </div>
          {customers.length === 0 ? (
            <div className="dashboard-empty">
              <Users aria-hidden="true" />
              <strong>No customer accounts yet</strong>
              <span>New registrations will appear here.</span>
            </div>
          ) : null}
          <div className="admin-user-list">
            {customers.map((user) => (
              <article className="admin-user" key={user.id}>
                <div className="admin-user-header">
                  <div className="admin-user-identity">
                    <strong>{user.email}</strong>
                    <span>
                      Joined {new Date(user.createdAt).toLocaleDateString()} · {user.wallets.length} linked {user.wallets.length === 1 ? "wallet" : "wallets"}
                    </span>
                  </div>
                  <span className={`status-pill ${user.status}`}>{user.status}</span>
                </div>
                {user.wallets.length ? (
                  <div className="admin-wallet-list">
                    {user.wallets.map((wallet) => (
                      <div className="admin-wallet" key={wallet.id}>
                        <div>
                          <code>{wallet.address}</code>
                          <span>{chains[wallet.chainId] ?? `Chain ${wallet.chainId}`} · Linked {new Date(wallet.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          className="icon-button dashboard-icon-button unlink-button"
                          type="button"
                          aria-label={`Unlink wallet ${wallet.address}`}
                          onClick={() => unlinkWallet(user, wallet)}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-no-wallets">No linked wallet addresses.</p>
                )}
                <div className="admin-user-actions">
                  <button className="button admin-action" type="button" onClick={() => void setStatus(user)}>
                    {user.status === "active" ? <Ban aria-hidden="true" /> : <Check aria-hidden="true" />}
                    {user.status === "active" ? "Suspend account" : "Reactivate account"}
                  </button>
                  <button className="button danger-button admin-action" type="button" onClick={() => void deleteUser(user)}>
                    <Trash2 aria-hidden="true" /> Delete account
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card" aria-labelledby="admin-activity-title">
          <div className="dashboard-card-heading compact">
            <div className="dashboard-card-icon"><ShieldCheck aria-hidden="true" /></div>
            <div>
              <h2 id="admin-activity-title">Admin activity</h2>
              <p>Recent account and wallet management actions.</p>
            </div>
          </div>
          {activity.length ? (
            <div className="audit-list">
              {activity.map((event, index) => (
                <div className="audit-row" key={`${event.createdAt}-${index}`}>
                  <span>{event.action.replaceAll("_", " ")}</span>
                  <span>{event.adminEmail}</span>
                  <time dateTime={new Date(event.createdAt).toISOString()}>
                    {new Date(event.createdAt).toLocaleString()}
                  </time>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-no-wallets">No admin actions have been recorded.</p>
          )}
        </section>
        <p className="admin-privacy-note">
          Admins can see account email addresses and linked public addresses only. Passwords, signatures, private keys, and recovery phrases are not accessible.
        </p>
      </div>
    </main>
  );
}
