import fs from "fs/promises";
import path from "path";
import { getMongoClientPromise, getDbName } from "./mongodb";

/**
 * Content storage: MongoDB Atlas.
 *
 * Previously this file read and wrote data/content.json directly with
 * Node's fs module. That works locally but not on Vercel: Vercel's deployed
 * functions run on a read-only filesystem, so any write attempt fails with
 * `EROFS: read-only file system`. All reads and writes now go through
 * MongoDB instead — data/content.json is kept only as the one-time seed
 * used to populate the database the first time the site runs against a
 * fresh, empty database. Nothing ever writes back to that file.
 *
 * Every other file in this project (all of app/api/**, every page) calls
 * getContent()/saveContent()/getCategory() from here and never touches
 * storage directly — so this is the only file that needed to change to
 * move the whole site onto MongoDB.
 */

const SEED_PATH = path.join(process.cwd(), "data", "content.json");
const COLLECTION_NAME = "siteContent";
/** Fixed id for the single document this project stores everything in. */
const DOC_ID = "main";

export type CategoryTheme = "school" | "gift" | "print" | "creative" | "photo";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  /**
   * Cloudinary public_id for this asset — needed to delete or replace the
   * image on Cloudinary. Optional so older/manually-added entries without
   * one don't break; anything uploaded through the admin dashboard will
   * always have one.
   */
  publicId?: string;
}

export interface Category {
  id: string;
  name: string;
  theme: CategoryTheme;
  description: string;
  images: GalleryImage[];
}

export interface BusinessHours {
  day: string;
  time: string;
}

export interface Business {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapEmbedUrl: string;
  mapLink: string;
  hours: BusinessHours[];
  social: { facebook: string; instagram: string };
}

export interface Hero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface WhyChooseUsItem {
  title: string;
  detail: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface SiteContent {
  business: Business;
  hero: Hero;
  whyChooseUs: WhyChooseUsItem[];
  testimonials: Testimonial[];
  categories: Category[];
}

interface StoredDocument extends SiteContent {
  _id: string;
}

async function getCollection() {
  const client = await getMongoClientPromise();
  return client.db(getDbName()).collection<StoredDocument>(COLLECTION_NAME);
}

/**
 * Reads data/content.json as a one-time seed. This is a read-only
 * filesystem operation, which — unlike writing — works fine on Vercel:
 * files shipped as part of the deployment are readable, only writes to
 * the deployed filesystem fail. This function is only ever called once,
 * the first time the site runs against an empty database.
 */
async function loadSeedContent(): Promise<SiteContent> {
  const raw = await fs.readFile(SEED_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function getContent(): Promise<SiteContent> {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: DOC_ID });

  if (doc) {
    const { _id, ...content } = doc;
    return content;
  }

  // First run against an empty database — seed it from data/content.json.
  const seed = await loadSeedContent();
  try {
    await collection.insertOne({ _id: DOC_ID, ...seed });
  } catch (err) {
    // Two requests can race to seed on a cold start; if another request
    // already inserted the document, MongoDB reports a duplicate key
    // error (code 11000) — that's fine, just read what's there now.
    const isDuplicateKey = (err as { code?: number } | null)?.code === 11000;
    if (!isDuplicateKey) throw err;
  }

  const finalDoc = await collection.findOne({ _id: DOC_ID });
  if (finalDoc) {
    const { _id, ...content } = finalDoc;
    return content;
  }
  // Extremely unlikely fallback (e.g. the doc was deleted between the
  // insert race and this read) — still return usable content.
  return seed;
}

export async function saveContent(content: SiteContent): Promise<void> {
  const collection = await getCollection();
  await collection.replaceOne({ _id: DOC_ID }, { _id: DOC_ID, ...content }, { upsert: true });
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const content = await getContent();
  return content.categories.find((c) => c.id === id);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
