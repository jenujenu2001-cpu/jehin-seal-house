/**
 * Temporary, frontend-only placeholder art for sections and category
 * previews that don't have real shop photos yet.
 *
 * These are local SVG files under /public/placeholders — no external
 * service, no network dependency, nothing that can 403 or go down. This
 * file previously pulled images from loremflickr.com, which intermittently
 * returned 403 Forbidden and made the site depend on a third-party service
 * being up. That dependency has been removed entirely.
 *
 * This file is purely presentational — it does not touch data/content.json,
 * the admin panel, or any API route. As soon as a category has real
 * `images` (uploaded through /admin), those take over automatically; see
 * `getCategoryPreviewImages` below. Every export here keeps its original
 * name and shape, so no component that consumes this file needed to change.
 */

import type { Category, CategoryTheme } from "@/lib/content";

const THEME_IMAGE: Record<CategoryTheme, string> = {
  school: "/placeholders/theme-school.svg",
  gift: "/placeholders/theme-gift.svg",
  print: "/placeholders/theme-print.svg",
  creative: "/placeholders/theme-creative.svg",
  photo: "/placeholders/theme-photo.svg"
};

/** Deterministic preview set (4–8 images) for a category, real photos first. */
export function getCategoryPreviewImages(category: Category, count = 6) {
  if (category.images.length > 0) {
    return category.images.slice(0, count).map((img) => ({ url: img.url, alt: img.alt, isPlaceholder: false }));
  }
  const url = THEME_IMAGE[category.theme];
  return Array.from({ length: count }, () => ({
    url,
    alt: `${category.name} sample — Jehin Seal House`,
    isPlaceholder: true
  }));
}

/** One representative cover image for a category card. */
export function getCategoryCoverImage(category: Category): { url: string; isPlaceholder: boolean } {
  if (category.images.length > 0) {
    return { url: category.images[0].url, isPlaceholder: false };
  }
  return { url: THEME_IMAGE[category.theme], isPlaceholder: true };
}

/** Large full-width section background images, keyed by purpose. */
export const SECTION_BACKGROUNDS = {
  hero: "/placeholders/section-hero.svg",
  process: "/placeholders/section-process.svg",
  cta: "/placeholders/section-cta.svg",
  about: "/placeholders/section-about.svg",
  aboutSecondary: "/placeholders/section-about-2.svg",
  contactStore: "/placeholders/section-contact.svg",
  footer: "/placeholders/section-footer.svg",
  reviews: "/placeholders/section-reviews.svg"
};

/** Rotating strip of workshop/equipment cards for the showcase marquee. */
export const SHOWCASE_IMAGES = [
  { url: "/placeholders/workshop.svg", label: "Digital Presses" },
  { url: "/placeholders/workshop.svg", label: "T-Shirt Printing" },
  { url: "/placeholders/workshop.svg", label: "Laser Printing" },
  { url: "/placeholders/workshop.svg", label: "Mug Printing" },
  { url: "/placeholders/workshop.svg", label: "Vinyl Cutting" },
  { url: "/placeholders/workshop.svg", label: "Banner Printing" },
  { url: "/placeholders/workshop.svg", label: "Acrylic Signage" },
  { url: "/placeholders/workshop.svg", label: "Invitation Cards" }
];

/** Customer avatar placeholder for the reviews slider. */
export function getAvatarImage(_seed: string) {
  return "/placeholders/avatar.svg";
}

/** Why-choose-us image-card backgrounds. */
export const WHY_CHOOSE_US_IMAGES = [
  "/placeholders/theme-print.svg",
  "/placeholders/theme-creative.svg",
  "/placeholders/theme-gift.svg",
  "/placeholders/theme-school.svg",
  "/placeholders/theme-photo.svg",
  "/placeholders/workshop.svg"
];
