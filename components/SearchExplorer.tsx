"use client";

import { useMemo, useState } from "react";
import CategoryCard from "./CategoryCard";
import type { Category } from "@/lib/content";

export default function SearchExplorer({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.theme.includes(q)
    );
  }, [query, categories]);

  return (
    <div>
      <div className="relative">
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="9" r="6" />
          <path d="m17 17-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: tie, badge, bottle, cup, frame, logo…"
          className="w-full rounded-full border border-ink/15 bg-paper py-3.5 pl-12 pr-5 text-base text-ink placeholder:text-ink/40 focus:border-moss"
        />
      </div>

      <p className="mt-4 text-sm text-ink/50">
        {results.length} service{results.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/20 py-14 text-center">
          <p className="font-display text-lg text-ink/70">No matches for “{query}”</p>
          <p className="mt-2 text-sm text-ink/50">Try a shorter word, or message us on WhatsApp and we'll check for you.</p>
        </div>
      )}
    </div>
  );
}
