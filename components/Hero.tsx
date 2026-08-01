"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WhatsAppInlineButton } from "./WhatsAppButton";
import type { Hero as HeroContent } from "@/lib/content";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

const PARTICLES = [
  { top: "14%", left: "8%", size: 6, delay: 0 },
  { top: "22%", left: "82%", size: 10, delay: 0.6 },
  { top: "62%", left: "90%", size: 5, delay: 1.1 },
  { top: "76%", left: "14%", size: 8, delay: 0.3 },
  { top: "40%", left: "48%", size: 4, delay: 1.5 },
  { top: "85%", left: "60%", size: 7, delay: 0.9 },
  { top: "10%", left: "55%", size: 5, delay: 1.8 }
];

function PrintIcon({ className, path }: { className?: string; path: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function Hero({ hero, whatsapp }: { hero: HeroContent; whatsapp: string }) {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-center overflow-hidden bg-charcoal">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.hero})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
      <div className="absolute inset-0 texture-halftone opacity-[0.06]" aria-hidden="true" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle animate-floatY"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
        <PrintIcon
          className="absolute right-[12%] top-[18%] h-14 w-14 text-amber/25 animate-floatYSlow"
          path="M6 9V4h12v5M4 9h16v7H4z M7 16h10v5H7z"
        />
        <PrintIcon
          className="absolute left-[10%] top-[58%] h-16 w-16 text-paper/15 animate-floatX"
          path="M4 7h16M4 12h10M4 17h13"
        />
        <PrintIcon
          className="absolute right-[22%] bottom-[12%] h-10 w-10 text-amber/20 animate-spinSlow"
          path="M12 3v3M4.5 7.5 6.6 9.6M3 15h3M4.5 22.5 6.6 20.4M12 21v-3M19.5 22.5l-2.1-2.1M21 15h-3M19.5 7.5l-2.1 2.1"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow inline-flex glass-panel rounded-full px-4 py-1.5 text-amber"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-paper sm:text-5xl md:text-6xl"
        >
          {hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-xl font-body text-lg leading-relaxed text-paper/80"
        >
          {hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/services"
            className="rounded-full bg-amber px-6 py-3 text-base font-semibold text-charcoal transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            View Our Works
          </Link>
          <WhatsAppInlineButton
            whatsapp={whatsapp}
            label={hero.ctaPrimary}
            className="px-6 py-3 text-base"
          />
          <a
            href="#gallery"
            className="glass-panel inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-paper transition-transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m8 6 10 6-10 6V6Z" />
            </svg>
            Watch Gallery
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper/70"
        >
          <span>26+ services in-house</span>
          <span className="hidden sm:inline">·</span>
          <span>Bulk school orders welcome</span>
          <span className="hidden sm:inline">·</span>
          <span>Same-day WhatsApp quotes</span>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-paper/60"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-paper/40 p-1">
          <span className="h-1.5 w-1 animate-floatY rounded-full bg-paper/70" />
        </div>
      </motion.div>
    </section>
  );
}
