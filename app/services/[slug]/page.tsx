import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import AnimatedSection from "@/components/AnimatedSection";
import { WhatsAppInlineButton } from "@/components/WhatsAppButton";
import { getContent } from "@/lib/content";
import { getCategoryCoverImage, getCategoryPreviewImages } from "@/lib/placeholderImages";

// Categories can be added/edited from the admin dashboard at any time, so
// this page is rendered dynamically on each request rather than pre-built.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const content = await getContent();
  const category = content.categories.find((c) => c.id === params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} By ${content.business.name}, ${content.business.address}.`
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const content = await getContent();
  const category = content.categories.find((c) => c.id === params.slug);
  if (!category) notFound();

  const related = content.categories.filter((c) => c.theme === category.theme && c.id !== category.id).slice(0, 4);
  const banner = getCategoryCoverImage(category);

  return (
    <>
      <section
        className="relative flex min-h-[46vh] items-end overflow-hidden bg-fixed-cover"
        style={{ backgroundImage: `url(${banner.url})` }}
      >
        <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14">
          <AnimatedSection>
            <Link href="/services" className="text-sm font-medium text-amber hover:text-paper">← All Services</Link>
            <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">{category.name}</h1>
            <p className="mt-3 max-w-2xl text-paper/80">{category.description}</p>
            <div className="mt-6">
              <WhatsAppInlineButton
                whatsapp={content.business.whatsapp}
                message={`Hi, I'd like a quote for ${category.name}.`}
                label={`Ask about ${category.name}`}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        {(() => {
          const hasReal = category.images.length > 0;
          const previews = getCategoryPreviewImages(category, 8);
          const galleryImages = hasReal
            ? category.images
            : previews.map((p, i) => ({ id: `placeholder-${i}`, url: p.url, alt: p.alt }));
          return <Gallery images={galleryImages} categoryName={category.name} isPlaceholder={!hasReal} />;
        })()}
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-paper py-14">
          <div className="mx-auto max-w-6xl px-5">
            <p className="eyebrow text-moss">You might also need</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/services/${r.id}`}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/80 hover:border-moss hover:text-moss"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
