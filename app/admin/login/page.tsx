"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let res: Response;
    try {
      res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
    } catch {
      setLoading(false);
      setError("Could not reach the server. Check your connection and try again.");
      return;
    }

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(searchParams.get("from") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-16">
      <p className="eyebrow text-moss">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink/60">Manage categories, photos, and site content.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink/80">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink focus:border-moss"
          />
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-fern disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
