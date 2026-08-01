import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppButton";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jehinsealhouse.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jehin Seal House — Printing & Custom Gifts in Jaffna",
    template: "%s | Jehin Seal House"
  },
  description:
    "Jehin Seal House, No. 62 Stanley Road, Jaffna — school ties, badges, banners, stickers, jerseys, acrylic signage, invitation cards and custom gifts, all printed in-house.",
  keywords: [
    "printing Jaffna",
    "custom gifts Jaffna",
    "school tie printing",
    "banner printing Jaffna",
    "sticker printing Sri Lanka",
    "acrylic name board",
    "Jehin Seal House"
  ],
  openGraph: {
    title: "Jehin Seal House — Printing & Custom Gifts in Jaffna",
    description: "26+ printing and custom gift services under one roof in Jaffna. Message us on WhatsApp for a quote.",
    url: siteUrl,
    siteName: "Jehin Seal House",
    locale: "en_LK",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jehin Seal House — Printing & Custom Gifts in Jaffna",
    description: "26+ printing and custom gift services under one roof in Jaffna."
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.business.name,
    image: `${siteUrl}/og-image.jpg`,
    description: content.business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.business.address,
      addressCountry: "LK"
    },
    telephone: content.business.phone,
    url: siteUrl,
    openingHoursSpecification: content.business.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      description: h.time
    }))
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header categories={content.categories} whatsapp={content.business.whatsapp} />
        <main>{children}</main>
        <Footer business={content.business} categories={content.categories} />
        <WhatsAppFloatingButton whatsapp={content.business.whatsapp} />
      </body>
    </html>
  );
}
