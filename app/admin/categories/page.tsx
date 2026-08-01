"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category, CategoryTheme } from "@/lib/content";

const THEMES: CategoryTheme[] = ["school", "gift", "print", "creative", "photo"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<CategoryTheme>("print");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/categories");
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        setLoadError((data && data.error) || "Could not load categories. Please refresh.");
        setCategories([]);
        return;
      }
      setCategories(data);
    } catch {
      setLoadError("Could not reach the server. Check your connection and refresh.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    let res: Response;
    try {
      res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, theme })
      });
    } catch {
      setSaving(false);
      setError("Could not reach the server. Check your connection and try again.");
      return;
    }
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not create category");
      return;
    }
    setName("");
    setDescription("");
    setTheme("print");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category and all of its photos? This cannot be undone.")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
    } catch {
      setLoadError("Could not delete the category — check your connection and try again.");
      return;
    }
    load();
  }

  async function handleUpdate(cat: Category) {
    setSaving(true);
    try {
      await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cat.name, description: cat.description, theme: cat.theme })
      });
    } catch {
      setLoadError("Could not save changes — check your connection and try again.");
    } finally {
      setSaving(false);
      setEditingId(null);
      load();
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-ink/60">Add, edit, or remove service categories. Manage each category's photos from its page.</p>

      <form onSubmit={handleAdd} className="mt-8 grid gap-4 rounded-2xl border border-ink/10 bg-paper p-6 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-ink/80">Category name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Wedding Card Printing"
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2 text-sm focus:border-moss"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Background theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as CategoryTheme)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2 text-sm capitalize focus:border-moss"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-moss px-4 py-2 text-sm font-semibold text-paper hover:bg-fern disabled:opacity-60"
          >
            Add Category
          </button>
        </div>
        <div className="sm:col-span-4">
          <label className="text-sm font-medium text-ink/80">Short description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shown on the category card and page"
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2 text-sm focus:border-moss"
          />
        </div>
        {error && <p className="text-sm text-clay sm:col-span-4">{error}</p>}
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-ink/50">Loading…</p>}
        {loadError && <p className="text-sm text-clay">{loadError}</p>}
        {!loading && categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-ink/10 bg-paper p-4">
            {editingId === cat.id ? (
              <EditRow category={cat} onCancel={() => setEditingId(null)} onSave={handleUpdate} saving={saving} />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{cat.name}</p>
                  <p className="text-sm text-ink/55">{cat.images.length} photo{cat.images.length === 1 ? "" : "s"} · theme: {cat.theme}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/categories/${cat.id}`} className="rounded-full border border-moss px-4 py-1.5 text-sm font-medium text-moss hover:bg-moss hover:text-paper">
                    Manage Photos
                  </Link>
                  <button onClick={() => setEditingId(cat.id)} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70 hover:border-ink/30">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="rounded-full border border-clay/40 px-4 py-1.5 text-sm font-medium text-clay hover:bg-clay hover:text-paper">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditRow({
  category,
  onSave,
  onCancel,
  saving
}: {
  category: Category;
  onSave: (c: Category) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<Category>(category);

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm sm:col-span-1"
      />
      <input
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm sm:col-span-2"
      />
      <select
        value={draft.theme}
        onChange={(e) => setDraft({ ...draft, theme: e.target.value as CategoryTheme })}
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm capitalize"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <div className="flex gap-2 sm:col-span-4">
        <button onClick={() => onSave(draft)} disabled={saving} className="rounded-full bg-moss px-4 py-1.5 text-sm font-semibold text-paper hover:bg-fern">
          Save
        </button>
        <button onClick={onCancel} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
          Cancel
        </button>
      </div>
    </div>
  );
}
