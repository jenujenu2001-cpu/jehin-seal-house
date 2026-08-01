import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import MasonryGallery from "@/components/MasonryGallery";
import ProcessTimeline from "@/components/ProcessTimeline";
import WhyChooseUsCards from "@/components/WhyChooseUsCards";
import PrintingShowcase from "@/components/PrintingShowcase";
import CTASection from "@/components/CTASection";
import Testimonials from "@/components/Testimonials";
import AnimatedSection from "@/components/AnimatedSection";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  const { hero, business, whyChooseUs, testimonials, categories } = content;
  const signature = categories.slice(0, 3);

  return (
    <>
      <Hero hero={hero} whatsapp={business.whatsapp} />

      {/* Trust strip */}
      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-6 px-5 py-6 text-sm text-ink/60">
          <p className="font-display text-base text-ink">26+ printing &amp; gift services</p>
          <p>Bulk school orders welcome</p>
          <p>Same-shop design, print &amp; finishing</p>
          <p>Order straight over WhatsApp</p>
        </div>
      </section>

      {/* Signature category deep-dives with real preview images */}
      <section className="py-20">
        <AnimatedSection className="mx-auto max-w-6xl px-5">
          <p className="eyebrow text-moss">See It Before You Ask</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
            A closer look at what we make
          </h2>
        </AnimatedSection>
        <div className="mt-14">
          <CategoryShowcase categories={signature} whatsapp={business.whatsapp} />
        </div>
      </section>

      {/* Full services grid — almost everything, at a glance */}
      <section className="theme-print texture-leaf border-y border-ink/10">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <AnimatedSection className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-moss">Every Service We Offer</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
                One shop, almost every kind of printing
              </h2>
            </div>
            <Link href="/services" className="font-semibold text-moss hover:text-fern">
              Full services index →
            </Link>
          </AnimatedSection>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <AnimatedSection key={c.id} delay={Math.min((i % 8) * 0.05, 0.3)}>
                <CategoryCard category={c} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>



      {/* Process */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <AnimatedSection>
          <p className="eyebrow text-moss">Our Process</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">From order to delivery</h2>
        </AnimatedSection>
        <ProcessTimeline />
      </section>

      {/* Why choose us */}
      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <AnimatedSection>
            <p className="eyebrow text-moss">Why Choose Us</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
              One print shop, every finish done properly
            </h2>
          </AnimatedSection>
          <div className="mt-10">
            <WhyChooseUsCards items={whyChooseUs} />
          </div>
        </div>
      </section>



      {/* Reviews */}
      <section
        className="relative overflow-hidden bg-fixed-cover py-24"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.reviews})` }}
      >
        <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
        <div className="relative">
          <AnimatedSection className="mx-auto max-w-2xl px-5 text-center">
            <p className="eyebrow text-amber">Customer Reviews</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">Trusted around Jaffna</h2>
          </AnimatedSection>
          <div className="mt-10 px-5">
            <Testimonials testimonials={testimonials} />
          </div>
        </div>
      </section>

      <CTASection whatsapp={business.whatsapp} />
    </>
  );
}
