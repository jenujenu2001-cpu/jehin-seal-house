import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { Category } from "@/lib/content";
import { getCategoryPreviewImages } from "@/lib/placeholderImages";
import AnimatedSection from "./AnimatedSection";
import { WhatsAppInlineButton } from "./WhatsAppButton";

export default function CategoryShowcase({
  categories,
  whatsapp
}: {
  categories: Category[];
  whatsapp: string;
}) {
  return (
    <div className="space-y-20">
      {categories.map((category, i) => {
        const images = getCategoryPreviewImages(category, 6);
        const reversed = i % 2 === 1;

        return (
          <AnimatedSection key={category.id} className="mx-auto max-w-6xl px-5">
            <div className={clsx("flex flex-col gap-8 lg:flex-row lg:items-center", reversed && "lg:flex-row-reverse")}>
              {/* Image mosaic */}
              <Link href={`/services/${category.id}`} className="group grid w-full flex-1 grid-cols-3 gap-2.5 sm:gap-3">
                <div className="hover-lift relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl">
                  <Image src={images[0].url} alt={images[0].alt} fill sizes="40vw" className="hover-zoom-img object-cover" />
                </div>
                {images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="hover-lift relative aspect-square overflow-hidden rounded-xl">
                    <Image src={img.url} alt={img.alt} fill sizes="20vw" className="hover-zoom-img object-cover" />
                  </div>
                ))}
              </Link>

              {/* Copy */}
              <div className="flex-1">
                <span className="eyebrow text-moss">Featured Service</span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{category.name}</h3>
                <p className="mt-3 max-w-md text-ink/70">{category.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/services/${category.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-fern"
                  >
                    View Full Gallery <span aria-hidden="true">→</span>
                  </Link>
                  <WhatsAppInlineButton
                    whatsapp={whatsapp}
                    message={`Hi, I'd like a quote for ${category.name}.`}
                    label="Get a Quote"
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        );
      })}
    </div>
  );
}
