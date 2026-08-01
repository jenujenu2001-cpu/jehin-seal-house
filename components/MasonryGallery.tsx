"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/content";
import { getCategoryPreviewImages } from "@/lib/placeholderImages";

interface MasonryItem {
  url: string;
  alt: string;
  categoryId: string;
  categoryName: string;
  span: "short" | "medium" | "tall";
}

export default function MasonryGallery({ categories }: { categories: Category[] }) {
  const items: MasonryItem[] = categories.flatMap((cat, ci) => {
    const imgs = getCategoryPreviewImages(cat, cat.images.length > 0 ? cat.images.length : 2);
    return imgs.slice(0, 3).map((img, i) => ({
      url: img.url,
      alt: img.alt,
      categoryId: cat.id,
      categoryName: cat.name,
      span: (["short", "tall", "medium"] as const)[(ci + i) % 3]
    }));
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoomed(false);
  }, []);
  const next = useCallback(() => {
    setZoomed(false);
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);
  const prev = useCallback(() => {
    setZoomed(false);
    setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  const spanClass: Record<MasonryItem["span"], string> = {
    short: "row-span-4",
    medium: "row-span-5",
    tall: "row-span-6"
  };

  return (
    <>
      <div className="grid auto-rows-[26px] grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={`${item.categoryId}-${i}`}
            onClick={() => setOpenIndex(i)}
            className={`hover-lift group relative overflow-hidden rounded-xl border border-ink/10 ${spanClass[item.span]}`}
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="hover-zoom-img object-cover"
            />
            <div className="absolute inset-0 img-overlay-card opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-2.5 left-3 text-xs font-semibold text-paper opacity-0 transition-opacity group-hover:opacity-100">
              {item.categoryName}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 p-4"
            role="dialog"
            aria-modal="true"
          >
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-3xl text-paper/80 hover:text-paper">
              ×
            </button>
            <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/10 p-3 text-paper hover:bg-paper/20 md:left-6">
              ‹
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[80vh] max-w-4xl flex-col items-center gap-4"
            >
              <img
                onClick={() => setZoomed((z) => !z)}
                src={items[openIndex].url}
                alt={items[openIndex].alt}
                className={`max-h-[70vh] w-auto cursor-zoom-in rounded-lg object-contain transition-transform duration-300 ${
                  zoomed ? "scale-150 cursor-zoom-out" : "scale-100"
                }`}
              />
              <Link
                href={`/services/${items[openIndex].categoryId}`}
                className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-charcoal hover:brightness-95"
              >
                View {items[openIndex].categoryName} Gallery →
              </Link>
            </motion.div>

            <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/10 p-3 text-paper hover:bg-paper/20 md:right-6">
              ›
            </button>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-paper/70">
              {openIndex + 1} / {items.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
