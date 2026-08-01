import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { WhatsAppInlineButton } from "@/components/WhatsAppButton";
import { getContent } from "@/lib/content";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit Jehin Seal House at No. 62 Stanley Road, Jaffna, or reach us on WhatsApp for a quote."
};

export default async function ContactPage() {
  const { business } = await getContent();

  return (
    <>
      <section
        className="relative flex min-h-[36vh] items-end overflow-hidden bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.contactStore})` }}
      >
        <div className="absolute inset-0 img-overlay-dark" aria-hidden="true" />
        <AnimatedSection className="relative mx-auto w-full max-w-6xl px-5 pb-12">
          <p className="eyebrow text-amber">Get In Touch</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">Visit or Message Us</h1>
          <p className="mt-3 max-w-xl text-paper/80">
            Drop by the shop on Stanley Road, or send your order straight to WhatsApp — no forms, no waiting.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <AnimatedSection className="overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm">
            <div className="relative h-48 w-full">
              <Image src={SECTION_BACKGROUNDS.contactStore} alt="Jehin Seal House storefront" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 img-overlay-card" />
              <p className="absolute bottom-3 left-5 font-display text-lg font-semibold text-paper">{business.name}</p>
            </div>

            <div className="space-y-6 p-7">
              <div>
                <p className="eyebrow text-clay">Address</p>
                <p className="mt-1 text-ink/80">{business.address}</p>
              </div>

              <div>
                <p className="eyebrow text-clay">Phone / WhatsApp</p>
                <p className="mt-1 text-ink/80">{business.phone}</p>
              </div>

              <div>
                <p className="eyebrow text-clay">Opening Hours</p>
                <ul className="mt-1 space-y-1 text-ink/80">
                  {business.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-6 text-sm">
                      <span>{h.day}</span>
                      <span className="text-ink/55">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <WhatsAppInlineButton whatsapp={business.whatsapp} label="Chat on WhatsApp" />
                <a
                  href={`tel:${business.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink hover:border-moss hover:text-moss"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 5c0 8.837 6.163 15 15 15l1-4-5-2-2 2c-2.5-1-4-2.5-5-5l2-2-2-5-4 1Z" strokeLinejoin="round" />
                  </svg>
                  Call Us
                </a>
                <a
                  href={business.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-moss px-5 py-2.5 text-sm font-semibold text-moss hover:bg-moss hover:text-paper"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="overflow-hidden rounded-2xl border border-ink/10">
            <iframe
              src={business.mapEmbedUrl}
              title="Jehin Seal House location"
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
