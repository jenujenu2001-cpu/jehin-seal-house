import Link from "next/link";
import { WhatsAppIcon } from "./WhatsAppButton";
import type { Business, Category } from "@/lib/content";
import { SECTION_BACKGROUNDS } from "@/lib/placeholderImages";

export default function Footer({
  business,
  categories
}: {
  business: Business;
  categories: Category[];
}) {
  const year = new Date().getFullYear();
  const featured = categories.slice(0, 8);

  return (
    <footer className="relative overflow-hidden text-mist">
      <div
        className="absolute inset-0 bg-fixed-cover"
        style={{ backgroundImage: `url(${SECTION_BACKGROUNDS.footer})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-charcoal/93" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-xl font-semibold text-paper">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-sm font-bold text-charcoal">JS</span>
            {business.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mist/75">{business.description}</p>
          <div className="mt-4 flex gap-3">
            <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-mist/70 hover:text-amber">
              FB
            </a>
            <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-mist/70 hover:text-amber">
              IG
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-amber">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-mist/85">
            <li><Link href="/" className="hover:text-paper">Home</Link></li>
            <li><Link href="/services" className="hover:text-paper">All Services</Link></li>
            <li><Link href="/about" className="hover:text-paper">About</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Contact</Link></li>
            <li><Link href="/search" className="hover:text-paper">Search</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-amber">Services</p>
          <ul className="mt-3 space-y-2 text-sm text-mist/85">
            {featured.map((c) => (
              <li key={c.id}>
                <Link href={`/services/${c.id}`} className="hover:text-paper">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-amber">Visit / Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-mist/85">
            <li>{business.address}</li>
            <li>{business.phone}</li>
            <li>
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-paper"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            {business.hours.map((h) => (
              <li key={h.day} className="text-mist/55">{h.day}: {h.time}</li>
            ))}
            <li>
              <a href={business.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                Get Directions →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-mist/55 sm:flex-row">
          <p>© {year} {business.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-paper">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
            <a href="#top" className="hover:text-paper">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
