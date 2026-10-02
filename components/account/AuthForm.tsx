"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Orbit } from "lucide-react";

export function AuthForm({ mode: initialMode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "Could not complete sign-in.");
        return;
      }
      router.replace(result.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="account-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link className="brand-lockup" href="/">
          <span className="brand-mark"><Orbit aria-hidden="true" /></span>
          NOVA
        </Link>
        <span className="eyebrow auth-eyebrow">
          <span className="eyebrow-dot" /> Your account
        </span>
        <h1 id="auth-title">{mode === "login" ? "Welcome back." : "Create your account."}</h1>
        <p className="auth-intro">
          {mode === "login"
            ? "Sign in to view your linked wallets and manage your account."
            : "Create a NOVA account to keep your wallet addresses organized."}
        </p>
        <form className="account-form" onSubmit={submit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={mode === "register" ? 12 : undefined}
            maxLength={128}
            required
          />
          {mode === "register" ? (
            <p className="form-hint">Use at least 12 characters. Your password is never shown to admins.</p>
          ) : null}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "New to NOVA?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              setMode((current) => current === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="auth-safety">
          We will never ask for a seed phrase, private key, or wallet recovery words.
        </p>
      </section>
    </main>
  );
}
