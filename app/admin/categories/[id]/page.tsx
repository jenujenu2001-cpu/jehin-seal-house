"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Category, GalleryImage } from "@/lib/content";

export default function AdminCategoryImagesPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [busyImageId, setBusyImageId] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const replaceTargetId = useRef<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/categories");
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        setError((data && data.error) || "Could not load this category. Please refresh.");
        setCategory(null);
        return;
      }
      const found = data.find((c: Category) => c.id === params.id) || null;
      setCategory(found);
    } catch {
      setError("Could not reach the server. Check your connection and refresh.");
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;
      setUploading(true);
      setError("");

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      try {
        const res = await fetch(`/api/categories/${params.id}/images`, {
          method: "POST",
          body: formData
        });
        setUploading(false);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Upload failed");
          return;
        }
        load();
      } catch {
        setUploading(false);
        setError("Could not reach the server. Check your connection and try again.");
      }
    },
    [params.id]
  );

  async function handleDeleteImage(imageId: string) {
    if (!confirm("Delete this photo?")) return;
    setBusyImageId(imageId);
    try {
      await fetch(`/api/categories/${params.id}/images/${imageId}`, { method: "DELETE" });
    } catch {
      setError("Could not delete the photo — check your connection and try again.");
      setBusyImageId(null);
      return;
    }
    load();
  }

  function handleReplaceClick(imageId: string) {
    replaceTargetId.current = imageId;
    replaceInputRef.current?.click();
  }

  async function handleReplaceFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const imageId = replaceTargetId.current;
    e.target.value = ""; // allow choosing the same file again later
    if (!file || !imageId) return;

    setBusyImageId(imageId);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/categories/${params.id}/images/${imageId}`, {
        method: "PUT",
        body: formData
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not replace the photo");
        setBusyImageId(null);
        return;
      }
      load();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setBusyImageId(null);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    if (!category) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= category.images.length) return;

    const reordered = [...category.images];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    // Optimistic update so the reorder feels instant.
    setCategory({ ...category, images: reordered });

    try {
      const res = await fetch(`/api/categories/${params.id}/images/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((img) => img.id) })
      });
      if (!res.ok) {
        setError("Could not save the new order — reloading.");
        load();
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      load();
    }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-ink/50">Loading…</div>;
  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-clay">
        {error || "Category not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/admin/categories" className="text-sm font-medium text-moss hover:text-fern">← All Categories</Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">{category.name} — Photos</h1>
      <p className="mt-1 text-sm text-ink/60">
        Drag and drop images, or click to browse. JPEG, PNG, or WEBP, up to 8MB each. Hover a photo to replace,
        delete, or reorder it.
      </p>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragOver ? "border-moss bg-mist/40" : "border-ink/20 bg-paper"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <p className="font-display text-lg text-ink">{uploading ? "Uploading…" : "Drop photos here"}</p>
        <p className="mt-1 text-sm text-ink/50">or click to choose files — multiple uploads supported</p>
      </label>

      {/* Hidden input reused for every "Replace" action */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleReplaceFileChosen}
      />

      {error && <p className="mt-3 text-sm text-clay">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {category.images.map((img: GalleryImage, index: number) => {
          const isBusy = busyImageId === img.id;
          return (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-ink/10">
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />

              {isBusy && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-xs font-semibold text-paper">
                  Working…
                </div>
              )}

              <div className="absolute inset-x-0 top-0 flex justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  aria-label="Move earlier"
                  className="rounded-full bg-ink/70 px-2 py-1 text-xs font-semibold text-paper disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === category.images.length - 1}
                  aria-label="Move later"
                  className="rounded-full bg-ink/70 px-2 py-1 text-xs font-semibold text-paper disabled:opacity-30"
                >
                  →
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleReplaceClick(img.id)}
                  className="rounded-full bg-paper/90 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-paper"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="rounded-full bg-clay/90 px-2.5 py-1 text-xs font-semibold text-paper hover:bg-clay"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {category.images.length === 0 && (
          <p className="col-span-full text-sm text-ink/50">No photos uploaded for this category yet.</p>
        )}
      </div>
    </div>
  );
}
