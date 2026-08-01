"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Even if the request fails, still send the admin back to the login
      // screen — staying logged into a broken session helps no one.
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-mist/40">
      {!isLogin && (
        <div className="border-b border-ink/10 bg-paper">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="font-display text-lg font-semibold text-ink">
                Admin
              </Link>
              <nav className="hidden gap-5 sm:flex">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "text-sm font-medium text-ink/70 hover:text-moss",
                      pathname?.startsWith(link.href) && "text-moss"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-ink/60 hover:text-moss">View site ↗</Link>
              <button onClick={handleLogout} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70 hover:border-clay hover:text-clay">
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
