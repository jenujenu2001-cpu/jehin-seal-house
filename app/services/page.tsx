import type { Metadata } from "next";
import CategoryCard from "@/components/CategoryCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getContent } from "@/lib/content";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Services",
  description: "Every printing and custom gift service offered by Jehin Seal House in Jaffna — 26+ categories, all made in-house."
};

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <>
      <section
        className="relative flex min-h-[42vh] items-end overflow-hidden bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.process})` }}
      >
        <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-5 pb-14">
          <p className="eyebrow text-amber">Everything We Make</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">All Services</h1>
          <p className="mt-3 max-w-2xl text-paper/75">
            {content.categories.length} categories, one shop. Tap any service to view its gallery and message us for a quote.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.categories.map((c, i) => (
            <AnimatedSection key={c.id} delay={Math.min(i * 0.03, 0.4)}>
              <CategoryCard category={c} />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
