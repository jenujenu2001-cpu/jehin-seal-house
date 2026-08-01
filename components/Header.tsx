"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { WhatsAppInlineButton } from "./WhatsAppButton";
import type { Category } from "@/lib/content";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Header({
  categories,
  whatsapp
}: {
  categories: Category[];
  whatsapp: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-colors duration-300",
        transparent ? "bg-transparent" : "border-b border-ink/10 bg-paper/90 backdrop-blur"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-2 font-display text-xl font-semibold tracking-tight transition-colors",
            transparent ? "text-paper" : "text-ink"
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-sm font-bold text-charcoal">
            JS
          </span>
          Jehin Seal House
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "font-body text-sm font-medium transition-colors",
                transparent ? "text-paper/85 hover:text-amber" : "text-ink/80 hover:text-moss",
                pathname === link.href && (transparent ? "text-amber" : "text-moss")
              )}
            >
              {link.label}
            </Link>
          ))}
          <SearchQuickLink transparent={transparent} />
        </nav>

        <div className="hidden md:block">
          <WhatsAppInlineButton whatsapp={whatsapp} label="WhatsApp Us" />
        </div>

        <button
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full border md:hidden",
            transparent ? "border-paper/40" : "border-ink/15"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={clsx("block h-0.5 w-5 transition-transform", transparent ? "bg-paper" : "bg-ink", open && "translate-y-2 rotate-45")} />
            <span className={clsx("block h-0.5 w-5 transition-opacity", transparent ? "bg-paper" : "bg-ink", open && "opacity-0")} />
            <span className={clsx("block h-0.5 w-5 transition-transform", transparent ? "bg-paper" : "bg-ink", open && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-1 font-body text-base text-ink" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/search" className="py-1 font-body text-base text-ink" onClick={() => setOpen(false)}>
              Search
            </Link>
          </nav>
          <div className="mt-4">
            <WhatsAppInlineButton whatsapp={whatsapp} label="WhatsApp Us" className="w-full" />
          </div>
        </div>
      )}
    </header>
  );
}

function SearchQuickLink({ transparent }: { transparent: boolean }) {
  return (
    <Link
      href="/search"
      className={clsx(
        "flex items-center gap-1.5 font-body text-sm font-medium transition-colors",
        transparent ? "text-paper/85 hover:text-amber" : "text-ink/80 hover:text-moss"
      )}
      aria-label="Search services"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="9" r="6" />
        <path d="m17 17-3.5-3.5" strokeLinecap="round" />
      </svg>
      Search
    </Link>
  );
}
