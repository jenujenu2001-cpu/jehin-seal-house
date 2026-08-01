import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { getContent } from "@/lib/content";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, mission, and values behind Jehin Seal House, Jaffna's printing and custom gift shop."
};

const TIMELINE = [
  { year: "Year 1", title: "Doors open on Stanley Road", detail: "Jehin Seal House starts with stamp making and digital printing for the local community." },
  { year: "Growth", title: "Schools start ordering direct", detail: "Ties, badges, name tags and ID cards become a core part of the workshop's daily orders." },
  { year: "Expansion", title: "Signage & large format added", detail: "Banners, flex, vinyl and acrylic name boards bring in shop and event customers across Jaffna." },
  { year: "Today", title: "26+ services, one address", detail: "From jerseys to wedding invitations, the shop now covers nearly every printing and custom gift need in one place." }
];

export default async function AboutPage() {
  const content = await getContent();

  return (
    <>
      {/* Hero banner */}
      <section
        className="relative flex min-h-[52vh] items-end overflow-hidden bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.about})` }}
      >
        <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-16">
          <AnimatedSection>
            <p className="eyebrow text-amber">Our Story</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">About {content.business.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/80">
              Started on Stanley Road with a simple idea: Jaffna families and businesses shouldn't need to visit
              five different shops for a stamp, a school badge, a banner, and a gift. Every press, cutter, and
              printer needed to make that true now sits under one roof.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission / Vision with side image */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <AnimatedSection className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={SECTION_BACKGROUNDS.aboutSecondary} alt="Inside the Jehin Seal House workshop" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </AnimatedSection>

          <div className="grid gap-6">
            <AnimatedSection className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
              <p className="eyebrow text-clay">Mission</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink">Make every order feel handled</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Whether it's one photo frame or five hundred school ties, every customer gets the same careful
                finishing and a straight answer on price and timeline.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
              <p className="eyebrow text-clay">Vision</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink">Jaffna's one-stop print shop</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                To keep growing the range of services in-house, so no school, shop, or family ever has to go
                elsewhere for print or custom gift work.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
              <p className="eyebrow text-clay">Quality</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink">Built on finishing, not shortcuts</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Every job goes through the same quality check before it reaches a customer — that consistency is
                what keeps schools, shops, and families coming back.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline on dark background */}
      <section className="relative overflow-hidden bg-charcoal py-20">
        <div className="absolute inset-0 texture-halftone opacity-[0.05]" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5">
          <AnimatedSection>
            <p className="eyebrow text-amber">Our Journey</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-paper">From one press to a full workshop</h2>
          </AnimatedSection>
          <ol className="mt-12 space-y-10 border-l border-paper/15 pl-7">
            {TIMELINE.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.08} className="relative">
                <span className="absolute -left-[33px] flex h-4 w-4 items-center justify-center rounded-full bg-amber ring-4 ring-charcoal" />
                <p className="font-mono text-xs uppercase tracking-wide text-amber">{step.year}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-paper">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-paper/65">{step.detail}</p>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </section>

      {/* Developer credit — unchanged, hardcoded, not admin-editable */}
      <section className="border-t border-ink/10 bg-paper py-10">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5">
          <img
            src="/dev-avatar.svg"
            alt="Jenujan, website developer"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-ink/10 object-cover"
          />
          <p className="text-sm text-ink/60">
            Website Designed &amp; Developed by <span className="font-semibold text-ink/80">Jenujan</span>
          </p>
        </div>
      </section>
    </>
  );
}
