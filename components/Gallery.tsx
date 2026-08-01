"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryImage } from "@/lib/content";

export default function Gallery({
  images,
  categoryName,
  isPlaceholder = false
}: {
  images: GalleryImage[];
  categoryName: string;
  isPlaceholder?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoomed(false);
  }, []);

  const next = useCallback(() => {
    setZoomed(false);
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setZoomed(false);
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

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

  if (images.length === 0) return null;

  return (
    <>
      {isPlaceholder && (
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-clay/30 bg-clay/10 px-4 py-1.5 text-xs font-medium text-clay">
          Sample {categoryName.toLowerCase()} photos — real work goes here once uploaded from the dashboard
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpenIndex(i)}
            className="hover-lift group relative aspect-square overflow-hidden rounded-xl border border-ink/10 bg-mist"
            aria-label={`Open ${img.alt} fullscreen`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="hover-zoom-img object-cover"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
            role="dialog"
            aria-modal="true"
          >
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-3xl text-paper/80 hover:text-paper">
              ×
            </button>

            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/10 p-3 text-paper hover:bg-paper/20 md:left-6"
            >
              ‹
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[85vh] max-w-4xl items-center justify-center overflow-hidden"
              onClick={() => setZoomed((z) => !z)}
            >
              <img
                src={images[openIndex].url}
                alt={images[openIndex].alt}
                className={`max-h-[85vh] w-auto cursor-zoom-in rounded-lg object-contain transition-transform duration-300 ${
                  zoomed ? "scale-150 cursor-zoom-out" : "scale-100"
                }`}
              />
            </motion.div>

            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/10 p-3 text-paper hover:bg-paper/20 md:right-6"
            >
              ›
            </button>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-paper/70">
              {openIndex + 1} / {images.length} — tap image to zoom
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
