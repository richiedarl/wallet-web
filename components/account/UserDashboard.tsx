"use client";

import Link from "next/link";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Copy, KeyRound, LogOut, Plus, ShieldCheck, Trash2, Wallet } from "lucide-react";

type LinkedWallet = {
  id: string;
  address: string;
  chainId: number;
  createdAt: number;
};

const chainNames: Record<number, string> = {
  1: "Ethereum",
  10: "Optimism",
  42161: "Arbitrum",
  8453: "Base",
};

export function UserDashboard({
  user,
  initialWallets,
}: {
  user: { email: string };
  initialWallets: LinkedWallet[];
}) {
  const router = useRouter();
  const [wallets, setWallets] = useState(initialWallets);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [linkRequested, setLinkRequested] = useState(false);
  const [linking, setLinking] = useState(false);
  const linkStarted = useRef(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();

  const refreshWallets = useCallback(async () => {
    const response = await fetch("/api/wallets", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load your linked wallets.");
    const result = (await response.json()) as { wallets: LinkedWallet[] };
    setWallets(result.wallets);
  }, []);

  useEffect(() => {
    if (!linkRequested || !isConnected || !address || linkStarted.current) return;
    linkStarted.current = true;
    setLinking(true);
    setError("");
    setNotice("");

    async function linkWallet() {
      try {
        const challengeResponse = await fetch("/api/wallet/challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, chainId }),
        });
        const challenge = (await challengeResponse.json()) as {
          nonce?: string;
          message?: string;
          error?: string;
        };
        if (!challengeResponse.ok || !challenge.nonce || !challenge.message) {
          throw new Error(challenge.error ?? "Could not start wallet verification.");
        }

        const signature = await signMessageAsync({ message: challenge.message });
        const verifyResponse = await fetch("/api/wallet/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nonce: challenge.nonce, signature }),
        });
        const result = (await verifyResponse.json()) as { error?: string };
        if (!verifyResponse.ok) throw new Error(result.error ?? "Wallet verification failed.");

        await refreshWallets();
        setNotice("Wallet linked. No transaction was submitted.");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Wallet verification failed.");
      } finally {
        linkStarted.current = false;
        setLinkRequested(false);
        setLinking(false);
      }
    }

    void linkWallet();
  }, [address, chainId, isConnected, linkRequested, refreshWallets, signMessageAsync]);

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

  async function unlinkWallet(wallet: LinkedWallet) {
    if (!window.confirm(`Unlink ${wallet.address}? This only removes it from your NOVA account.`)) return;
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/wallets/${wallet.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not unlink this wallet.");
        return;
      }
      setWallets((current) => current.filter((item) => item.id !== wallet.id));
      setNotice("Wallet unlinked from your NOVA account.");
    } catch {
      setError("Could not reach the server to unlink this wallet.");
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setNotice("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.get("currentPassword"),
          newPassword: form.get("newPassword"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not update your password.");
        return;
      }
      formElement.reset();
      setNotice("Password updated. Other sessions have been signed out.");
    } catch {
      setError("Could not reach the server to update your password.");
    }
  }

  async function deleteAccount() {
    const password = window.prompt("Enter your account password to permanently delete your NOVA account.");
    if (password === null) return;
    setError("");
    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string; redirectTo?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not delete your account.");
        return;
      }
      router.replace(result.redirectTo ?? "/");
      router.refresh();
    } catch {
      setError("Could not reach the server to delete your account.");
    }
  }

  function requestWalletLink() {
    setError("");
    setNotice("");
    if (!isConnected) {
      openConnectModal?.();
      setNotice("Connect your wallet, then choose Link wallet again to verify its address.");
      return;
    }
    setLinkRequested(true);
  }

  return (
    <main className="account-page dashboard-page">
      <div className="dashboard-wrap">
        <header className="dashboard-header">
          <div>
            <Link className="dashboard-back" href="/">
              <ArrowLeft aria-hidden="true" /> Back to NOVA
            </Link>
            <span className="eyebrow dashboard-eyebrow"><span className="eyebrow-dot" /> Personal account</span>
            <h1>Your account</h1>
            <p>{user.email}</p>
          </div>
          <button className="button dashboard-logout" onClick={logout} type="button">
            <LogOut aria-hidden="true" /> Sign out
          </button>
        </header>

        {notice ? <p className="dashboard-notice" role="status"><Check aria-hidden="true" /> {notice}</p> : null}
        {error ? <p className="dashboard-error" role="alert">{error}</p> : null}

        <section className="dashboard-card" aria-labelledby="wallets-title">
          <div className="dashboard-card-heading">
            <div className="dashboard-card-icon"><Wallet aria-hidden="true" /></div>
            <div>
              <h2 id="wallets-title">Linked wallets</h2>
              <p>Only public addresses are saved. Private keys remain in your wallet.</p>
            </div>
            <button className="button button-primary dashboard-action" onClick={requestWalletLink} disabled={linking} type="button">
              <Plus aria-hidden="true" /> {linking ? "Verify in wallet..." : "Link wallet"}
            </button>
          </div>
          {wallets.length ? (
            <div className="wallet-list">
              {wallets.map((wallet) => (
                <WalletRow key={wallet.id} wallet={wallet} onUnlink={unlinkWallet} />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <Wallet aria-hidden="true" />
              <strong>No wallets linked yet</strong>
              <span>Link an address by signing a free message in your wallet. No transaction is sent.</span>
            </div>
          )}
          <p className="wallet-safety-note">
            <ShieldCheck aria-hidden="true" />
            Never enter or share your seed phrase, recovery words, private key, or wallet password with NOVA.
          </p>
        </section>

        <section className="dashboard-card" aria-labelledby="security-title">
          <div className="dashboard-card-heading compact">
            <div className="dashboard-card-icon"><KeyRound aria-hidden="true" /></div>
            <div>
              <h2 id="security-title">Account security</h2>
              <p>Change your NOVA sign-in password.</p>
            </div>
          </div>
          <form className="password-form" onSubmit={changePassword}>
            <label>
              Current password
              <input name="currentPassword" type="password" autoComplete="current-password" required />
            </label>
            <label>
              New password
              <input name="newPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            </label>
            <button className="button" type="submit">Update password</button>
          </form>
        </section>

        <section className="dashboard-danger">
          <div>
            <h2>Delete NOVA account</h2>
            <p>Removes your profile and linked address records. This does not affect assets in your wallets.</p>
          </div>
          <button className="button danger-button" onClick={deleteAccount} type="button">
            <Trash2 aria-hidden="true" /> Delete account
          </button>
        </section>
      </div>
    </main>
  );
}

function WalletRow({
  wallet,
  onUnlink,
}: {
  wallet: LinkedWallet;
  onUnlink: (wallet: LinkedWallet) => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const address = `${wallet.address.slice(0, 8)}…${wallet.address.slice(-6)}`;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  }

  return (
    <article className="wallet-row">
      <span className="wallet-row-icon"><Wallet aria-hidden="true" /></span>
      <div className="wallet-row-details">
        <strong>{address}</strong>
        <span>{chainNames[wallet.chainId] ?? `Chain ${wallet.chainId}`} · Linked {new Date(wallet.createdAt).toLocaleDateString()}</span>
      </div>
      <button className="icon-button dashboard-icon-button" onClick={copyAddress} type="button" aria-label={
        copyStatus === "failed" ? "Could not copy wallet address" : copyStatus === "copied" ? "Wallet address copied" : "Copy wallet address"
      }>
        {copyStatus === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
      <button className="icon-button dashboard-icon-button unlink-button" onClick={() => onUnlink(wallet)} type="button" aria-label={`Unlink ${address}`}>
        <Trash2 aria-hidden="true" />
      </button>
    </article>
  );
}
