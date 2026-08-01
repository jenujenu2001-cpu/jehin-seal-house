"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/content";
import { getAvatarImage } from "@/lib/placeholderImages";

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const active = testimonials[index];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45 }}
        >
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full border-2 border-amber/60">
            <Image src={getAvatarImage(active.name)} alt={active.name} fill sizes="64px" className="object-cover" />
          </div>
          <div className="mt-4 flex justify-center">
            <Stars />
          </div>
          <blockquote className="mt-4 font-display text-xl leading-relaxed text-paper sm:text-2xl">
            “{active.quote}”
          </blockquote>
          <figcaption className="mt-4">
            <p className="font-semibold text-paper">{active.name}</p>
            <p className="text-sm text-paper/60">{active.role}</p>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIndex(i)}
              aria-label={`Show review from ${t.name}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-amber" : "w-2 bg-paper/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
