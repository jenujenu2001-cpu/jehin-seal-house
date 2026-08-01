import { WhatsAppInlineButton } from "./WhatsAppButton";
import AnimatedSection from "./AnimatedSection";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

export default function CTASection({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.cta})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 img-overlay-tint" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <AnimatedSection>
          <p className="eyebrow text-amber">Have a job in mind?</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">
            Send your design, get a quote the same day
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/80">
            One photo of your idea, badge, or logo on WhatsApp is all it takes to get started.
          </p>
          <div className="mt-8">
            <WhatsAppInlineButton whatsapp={whatsapp} label="Chat on WhatsApp Now" className="px-8 py-4 text-base" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
