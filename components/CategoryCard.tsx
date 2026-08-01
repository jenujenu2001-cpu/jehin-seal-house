import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/content";
import { getCategoryCoverImage } from "@/lib/placeholderImages";

const THEME_LABEL: Record<Category["theme"], string> = {
  school: "School & Education",
  gift: "Custom Gifts",
  print: "Print & Signage",
  creative: "Design & Creative",
  photo: "Photo & Keepsake"
};

export default function CategoryCard({ category }: { category: Category }) {
  const count = category.images.length;
  const cover = getCategoryCoverImage(category);

  return (
    <Link
      href={`/services/${category.id}`}
      className="hover-lift group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-ink/10 shadow-sm"
    >
      <Image
        src={cover.url}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="hover-zoom-img object-cover"
      />
      <div className="absolute inset-0 img-overlay-card" aria-hidden="true" />

      <span className="absolute right-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink/70">
        {THEME_LABEL[category.theme]}
      </span>

      <div className="relative z-10 p-5">
        <h3 className="font-display text-lg font-semibold text-paper sm:text-xl">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-paper/75">{category.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-paper/60">
            {count > 0 ? `${count} photo${count === 1 ? "" : "s"}` : "Sample gallery"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber px-3.5 py-1.5 text-xs font-semibold text-charcoal transition-transform group-hover:translate-x-1">
            View <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
