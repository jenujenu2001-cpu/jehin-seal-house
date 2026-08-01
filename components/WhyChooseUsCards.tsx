import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import type { WhyChooseUsItem } from "@/lib/content";
import { WHY_CHOOSE_US_IMAGES } from "@/lib/placeholderImages";

const ICON_PATHS = [
  "M6 9V4h12v5M4 9h16v7H4z M7 16h10v5H7z",
  "M12 3v3M4.5 7.5 6.6 9.6M3 15h3M4.5 22.5 6.6 20.4M12 21v-3M19.5 22.5l-2.1-2.1M21 15h-3M19.5 7.5l-2.1 2.1",
  "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  "M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4Z",
  "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21c0-4 3.6-7 8-7s8 3 8 7",
  "M4.5 12a7.5 7.5 0 0 1 13-5.1M19.5 12a7.5 7.5 0 0 1-13 5.1M9 3v4H5M15 21v-4h4"
];

export default function WhyChooseUsCards({ items }: { items: WhyChooseUsItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <AnimatedSection key={item.title} delay={i * 0.08}>
          <div className="hover-lift group relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={WHY_CHOOSE_US_IMAGES[i % WHY_CHOOSE_US_IMAGES.length]}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="hover-zoom-img object-cover"
            />
            <div className="absolute inset-0 img-overlay-tint" aria-hidden="true" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-charcoal">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICON_PATHS[i % ICON_PATHS.length]} />
                </svg>
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-paper">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">{item.detail}</p>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
