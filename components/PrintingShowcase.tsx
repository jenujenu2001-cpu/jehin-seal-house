import Image from "next/image";
import { SHOWCASE_IMAGES } from "@/lib/placeholderImages";

export default function PrintingShowcase() {
  const track = [...SHOWCASE_IMAGES, ...SHOWCASE_IMAGES];

  return (
    <div className="overflow-hidden">
      <div className="marquee-track gap-5 py-2">
        {track.map((item, i) => (
          <div
            key={i}
            className="hover-lift group relative h-64 w-48 flex-shrink-0 overflow-hidden rounded-2xl border border-paper/10 shadow-xl sm:h-72 sm:w-56"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image src={item.url} alt={item.label} fill sizes="220px" className="hover-zoom-img object-cover" />
            <div className="absolute inset-0 img-overlay-card" />
            <span className="absolute bottom-4 left-4 right-4 font-display text-base font-semibold text-paper">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
