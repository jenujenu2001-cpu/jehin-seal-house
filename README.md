# Jehin Seal House — Website

A complete, production-ready website for **Jehin Seal House**, a printing and custom gift shop in Jaffna, Sri Lanka. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion, with a built-in admin dashboard for managing categories, photos, and site content.

**No local filesystem dependency remains for anything the admin edits.** Dynamic content (categories, business info, hero text, testimonials) lives in **MongoDB Atlas**; uploaded photos live on **Cloudinary**. `data/content.json` is kept only as the one-time seed used to populate a fresh, empty database — nothing ever writes back to it. See "Content storage: MongoDB Atlas" and "Image storage: Cloudinary" below for setup.

---

## Content storage: MongoDB Atlas (read this first if you're deploying to Vercel)

Every piece of dynamic content — categories (and their photo lists), business info, hero copy, opening hours, "why choose us" items, testimonials — is stored in a single MongoDB document, read and written through `lib/content.ts`. This replaces the previous approach of reading/writing `data/content.json` directly with Node's `fs` module, which worked locally but failed in production on Vercel with:

```
EROFS: read-only file system, open '/var/task/data/content.json'
```

Vercel's deployed functions run on a read-only filesystem — writes there always fail. `lib/content.ts` no longer writes to disk at all. `data/content.json` is only ever *read*, and only once: the very first time the site runs against an empty database, to seed it with real starting content. Every read and write after that goes through MongoDB.

**Setup:** create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), then Database → Connect → "Drivers" to get your connection string, and add it to your environment (see `.env.example`):

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

Make sure your Atlas project's Network Access allows connections from Vercel — the simplest option is allowing `0.0.0.0/0` (anywhere), since Vercel doesn't publish a fixed set of outbound IPs on most plans.

**How it works:**
- `lib/mongodb.ts` — the connection helper. Caches the connection across warm serverless invocations (and across dev hot-reloads) using the standard pattern MongoDB documents for Next.js, so the site doesn't open a new database connection on every request.
- `lib/content.ts` — `getContent()` reads the single content document from MongoDB; if it doesn't exist yet (a brand new database), it's seeded once from `data/content.json` and inserted. `saveContent()` replaces that document. Every other file in the project — every API route, every page — calls these same two functions and never touches storage directly, so this was the only file that needed to change.
- If two requests race to seed an empty database at the same moment (e.g. two simultaneous cold starts), the second insert is handled gracefully rather than crashing.

Without `MONGODB_URI` set, any attempt to read or write content throws a clear error explaining what's missing, instead of a cryptic filesystem error.

## Image storage: Cloudinary

All gallery photo **uploads, deletes, and replacements go through Cloudinary**. Nothing is written to a local uploads folder — that approach (and the `public/uploads` folder itself) has been removed entirely, for the same reason as above: Vercel's production filesystem is read-only, so any locally-stored upload would vanish on the next deploy or cold start.

**Setup:** create a free account at [cloudinary.com](https://cloudinary.com), then copy three values from your Cloudinary dashboard into your environment (see `.env.example`):

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Without these set, the upload/replace endpoints return a clear error explaining what's missing rather than failing silently or crashing.

**What the admin dashboard can do**, all backed by Cloudinary + MongoDB together:
- **Upload** — drag-and-drop or click to browse, multiple files at once (`app/api/categories/[id]/images/route.ts`)
- **Delete** — removes the asset from Cloudinary and the reference from MongoDB, no orphaned files left behind
- **Replace** — hover a photo → "Replace" swaps just that photo's file while keeping its position in the gallery (`PUT /api/categories/[id]/images/[imageId]`)
- **Reorder** — hover a photo → the ← / → arrows move it earlier/later in the gallery (`PUT /api/categories/[id]/images/reorder`)
- **Add/update/remove categories**, and edit business info/hero/testimonials from Settings — all persisted to MongoDB, so these now work correctly on Vercel too, which they did not before this pass

Deleting a whole category cleans up every Cloudinary asset that belonged to it, the same way.

## Frontend redesign notes

The entire customer-facing frontend was redesigned into an image-driven, premium
"creative agency" look — full-screen photo hero, image service cards, a Pinterest-style
masonry gallery, an animated process timeline, image-backed "Why Choose Us" cards, a
review slider, an equipment showcase marquee, and full-bleed photo banners on About,
Contact, and every category page. Nothing about that layout or design changed in this pass.

**Placeholder photography:** since the shop hasn't uploaded real photos yet, `lib/placeholderImages.ts`
supplies local, generated SVG placeholder art (in `/public/placeholders/`) for hero/section
backgrounds and as a fallback for any category gallery that's still empty. These are local
files with no external dependency — nothing to go down, nothing that can 403.
The moment a category has real photos — uploaded the normal way through `/admin` — this
file gets out of the way automatically and the real photos take over everywhere (cards,
homepage mosaics, masonry gallery, category page). Category pages that are still showing
placeholders carry a small "sample photos" note so the shop knows to replace them.

## What's included

- **Public site**: home, all-services index, a dynamic gallery page per category (26 categories seeded), about, contact (with embeddable Google Map), search, privacy policy, terms.
- **Design**: a "proof sheet" visual language — halftone dot textures and soft botanical gradients — carried across a Fraunces/Plus Jakarta Sans type pairing, themed per service group (school, gift, print, creative, photo).
- **Gallery**: fullscreen lightbox with keyboard and tap navigation, zoom-on-tap, and a friendly empty state for categories with no photos yet.
- **WhatsApp-first contact**: floating button on every page, plus inline buttons in the header, footer, service cards, gallery pages, and contact page. No contact form. Number is read from site content, so it only needs to change in one place.
- **Admin dashboard** at `/admin` (password-protected):
  - Add / edit / delete categories
  - Drag-and-drop photo upload (JPEG/PNG/WEBP, multiple files, instant preview) and delete
  - Edit business info, opening hours, homepage hero text, and testimonials
  - Dashboard stats: total categories, total images, recent uploads
- **SEO**: per-page metadata, Open Graph & Twitter cards, JSON-LD `LocalBusiness` schema, auto-generated `sitemap.xml` and `robots.txt`, lazy-loaded images.
- **Developer credit**: a hardcoded name + avatar on the About page (`/public/dev-avatar.svg`) that is **not** connected to the admin panel in any way — only editing the source code changes it, by design.

## How content is stored

**Photos:** uploaded to Cloudinary — see the section above. Not affected by redeploys, filesystem type, or number of server instances.

**Everything else** (categories, business info, hero text, testimonials): stored in MongoDB Atlas — see "Content storage" above. `data/content.json` is bundled with the app only as the seed for a brand new, empty database; it's read once and never written to.

**No component to swap here anymore** — this used to be the one piece of the architecture still tied to the local filesystem (and the reason the site failed on Vercel with an `EROFS` error). That's resolved as of this pass: nothing the admin dashboard does writes to disk.

## Getting started

```bash
npm install
cp .env.example .env
```

Edit `.env` — see `.env.example` for the full list: `ADMIN_PASSWORD`, `ADMIN_SECRET`, `MONGODB_URI` (and optionally `MONGODB_DB_NAME`), and the three `CLOUDINARY_*` values.

Then run:

```bash
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the dashboard. The first request that needs content will automatically seed your MongoDB database from `data/content.json`.

## Deployment

1. Push this project to a Git repository.
2. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and a free [Cloudinary](https://cloudinary.com) account.
3. Deploy to Vercel (or any Node.js host) and set every variable from `.env.example`: `ADMIN_PASSWORD`, `ADMIN_SECRET`, `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_SITE_URL`.
4. In Atlas, make sure Network Access allows connections from Vercel (`0.0.0.0/0` is the simplest option).
5. Point your domain at the deployment and update `NEXT_PUBLIC_SITE_URL`.
6. Log into `/admin/login`, add the shop's real photos to each category, and fill in Settings with the real hero copy and testimonials. These now persist correctly on Vercel.

## Before going live — a short checklist

- [ ] Replace `ADMIN_PASSWORD` and `ADMIN_SECRET` with real, private values (never commit `.env`).
- [ ] Set `MONGODB_URI` (and `MONGODB_DB_NAME` if your connection string doesn't include a database name) — content reads/writes return a clear error until this is set.
- [ ] Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` — uploads return a clear error until these are set.
- [ ] In MongoDB Atlas, confirm Network Access allows connections from your deployment host.
- [ ] Upload real photos for each category from the admin dashboard (this automatically replaces the local placeholder art site-wide — homepage mosaics, masonry gallery, and the category page itself).
- [ ] Add a real `public/og-image.jpg` (1200×630) for social share previews.
- [ ] Double check the WhatsApp number and address in Settings.
- [ ] Swap the Google Maps embed/direction links in Settings for the shop's exact pin.
- [ ] Review `public/dev-avatar.svg` and the credit line in `app/about/page.tsx` if the developer name or image should change.

## Project structure

```
app/                    Pages (App Router) and API routes
  admin/                Password-protected dashboard
  api/                  Category, image, content, and auth endpoints
    categories/[id]/images/          Upload (POST) / list (GET)
    categories/[id]/images/[imageId] Delete (DELETE) / replace (PUT)
    categories/[id]/images/reorder   Reorder (PUT)
  services/[slug]/      Dynamic category gallery page
components/             Header, Footer, Hero, Gallery, cards, etc.
lib/                    content.ts (MongoDB-backed data access), mongodb.ts (connection
                        helper), cloudinary.ts (image storage), auth.ts (Node-only login
                        logic), auth-edge.ts (Edge-safe token verification for
                        middleware), apiError.ts, rateLimit.ts, placeholderImages.ts
data/content.json       One-time seed for a fresh MongoDB database — never written to
public/placeholders/    Local SVG placeholder art — no external image service
middleware.ts           Protects /admin pages and write API routes
```

## Changelog — production debugging pass

Two real, reproducible bugs were found and fixed, plus a set of hardening
changes to make the site more resilient in production:

**Fixed: Edge Runtime crash on every admin request**
`lib/auth.ts` imported Node's `crypto` module and was used directly by
`middleware.ts`. Since middleware always runs in the Edge Runtime (which
does not support Node's `crypto`), this crashed `/admin`, `/admin/login`,
and every mutating API call. Fixed by splitting auth into:
- `lib/constants.ts` — the shared cookie name, no runtime dependency
- `lib/auth.ts` — Node-only, used only by the login API route (password
  check + signing new session tokens)
- `lib/auth-edge.ts` — Edge-safe, used only by `middleware.ts` (verifies
  session tokens using the Web Crypto API instead of Node's `crypto`)

Both sides compute the same HMAC-SHA256 signature, so a token issued by
the Node side verifies correctly on the Edge side.

**Fixed: broken images (403 from loremflickr.com)**
All placeholder imagery previously came from `loremflickr.com`, which
returned 403s. Replaced with 15 locally generated SVG placeholders under
`/public/placeholders/` — no external service, nothing that can go down.
`next.config.mjs`'s `remotePatterns` reverted to empty since no remote
image domain is used anymore.

**Hardening**
- Every API route touching `fs` or `crypto` now explicitly sets
  `export const runtime = "nodejs"`, so this class of bug can't resurface
  if Next.js ever changes its default runtime behavior.
- Removed an indefinite in-memory cache in `lib/content.ts` — on a
  clustered/multi-process deployment, a save in one worker process would
  never invalidate another worker's stale cached copy. Now reads straight
  from disk every time (the file is small; this is not a bottleneck at
  this scale).
- All mutating API routes now wrap their handler in `lib/apiError.ts`, so
  a filesystem failure returns a clean JSON error instead of crashing
  into an HTML 500 page (which broke every `res.json()` call on the
  admin dashboard's end).
- Added `app/error.tsx` and `app/global-error.tsx` — there was no error
  boundary at all before, so any unexpected render error showed Next's
  raw crash screen.
- Fixed several admin-dashboard client pages (`categories`, the
  per-category image manager, `settings`, `login`, and the logout
  button) that called `fetch(...)` and `res.json()` without checking
  `res.ok` or catching network failures. A server hiccup could previously
  crash the page (`.find is not a function` on an error object) or leave
  a button stuck in a loading state forever with a silent console error.
  These now show a real error message and recover cleanly.
- Added a simple in-memory rate limiter (`lib/rateLimit.ts`) on the login
  endpoint — 5 attempts per 10 minutes per IP — since there was previously
  no brute-force protection at all on the admin password.
- Verified no `ADMIN_PASSWORD`/`ADMIN_SECRET` reference exists in any
  client-side (`"use client"`) file — secrets are only ever read
  server-side.

**Known limitation of this pass:** `npm install` / `npm run build` could
not be executed in the environment this fix was produced in (no network
access to the npm registry). Every change was verified by manual review,
import/usage tracing, and standalone `tsc` type-checking of the
dependency-free modules — but a real `npm run build` should still be run
before deploying, as the final verification step.

## Changelog — Cloudinary image storage migration (Vercel compatibility)

**Fixed: uploaded photos disappeared after redeploy on Vercel**
The admin dashboard previously wrote uploaded files to `public/uploads` with
Node's `fs.writeFile`. That works locally but not on Vercel, where the
production filesystem is read-only/ephemeral — every uploaded photo would
vanish on the next deploy or cold start. All upload/delete/replace logic
now goes through Cloudinary instead (`lib/cloudinary.ts`); `public/uploads`
has been removed entirely, and no route writes an image file to disk
anymore.

**New: Replace and Reorder**
Beyond the original Upload/Delete, the admin per-category photo manager
now supports:
- **Replace** — swap a photo's file in place without losing its position
  in the gallery (`PUT /api/categories/[id]/images/[imageId]`)
- **Reorder** — move a photo earlier/later with the ← / → controls on
  hover (`PUT /api/categories/[id]/images/reorder`)

**Also changed**
- `GalleryImage` gained an optional `publicId` field (the Cloudinary
  asset id), needed to delete or replace the right asset. Existing
  categories (all currently empty) aren't affected.
- Deleting a whole category now deletes every Cloudinary asset that
  belonged to it — no orphaned files left in the Cloudinary account.
- `next.config.mjs` now allows `res.cloudinary.com` for `next/image`.
- `MasonryGallery.tsx`'s grid tiles now use `next/image` (automatic
  resizing, lazy loading) instead of a plain `<img>` — its fullscreen
  lightbox view is intentionally left as a plain `<img>`, since that's
  a zoom/transform context `next/image`'s `fill` mode doesn't suit well.
- `.env.example` documents the three required `CLOUDINARY_*` variables;
  the upload/replace endpoints return a clear error (not a silent
  failure or crash) if they're missing.

**Explicitly out of scope for this pass, by design:** the site's design,
layout, animations, and every non-image admin feature are unchanged.
`data/content.json` (category/business/hero/testimonial metadata) still
uses the local filesystem — see the caveat under "Image storage:
Cloudinary" above for what that means on Vercel specifically, and why
it was left alone here.

**Known limitation of this pass:** as with the previous debugging pass,
`npm install` / `npm run build` could not be executed in this environment
(no network access to the npm registry, confirmed again this round — the
registry returned a 403). Every change was verified by manual review,
full-project grep sweeps for stray references, and brace-balance checks
across every touched file — but please run a real `npm install && npm run
build` before deploying, and send me the output if anything surfaces.

## Changelog — MongoDB Atlas migration (fixes EROFS on Vercel)

**Fixed: `EROFS: read-only file system` on every admin write in production**
`lib/content.ts` previously read and wrote `data/content.json` directly
with Node's `fs` module for *all* dynamic content — not just images (those
were already moved to Cloudinary in the previous pass). Any admin action
that changed categories, business info, hero copy, or testimonials tried
to write to Vercel's read-only production filesystem and failed with
exactly the error in the bug report. Fixed by moving all of that storage
to MongoDB Atlas:

- **New: `lib/mongodb.ts`** — a cached MongoDB connection helper, using
  the standard pattern for serverless/Next.js (caches the connection
  across warm Vercel invocations and dev hot-reloads instead of opening a
  new one per request).
- **Rewritten: `lib/content.ts`** — `getContent()` and `saveContent()` now
  read/write a single document in MongoDB instead of the JSON file.
  `data/content.json` is kept only as the seed for a brand new, empty
  database (read once, on the very first request, then never touched
  again). Every exported name and type is unchanged, so this was the only
  file in the project that needed to change — no API route, page, or
  component was touched.
- Handled the race where two requests could both try to seed an empty
  database on the same cold start (a MongoDB duplicate-key error is
  caught and treated as "someone else already seeded it").
- Added `MONGODB_URI` (required) and `MONGODB_DB_NAME` (optional) to
  `.env.example`, with setup notes including the Atlas Network Access
  step that's easy to miss.
- Added `experimental.outputFileTracingIncludes` in `next.config.mjs` so
  `data/content.json` is always bundled into the deployed function
  regardless of Next's automatic file-tracing heuristics — otherwise a
  missed trace could mean the first-ever request against an empty
  database has nothing to seed with.
- Verified every page/route that calls `getContent()` already had
  `export const dynamic = "force-dynamic"` (needed so `next build` never
  tries to statically prerender against a live database connection at
  build time) and `export const runtime = "nodejs"` on API routes (the
  MongoDB driver doesn't run on the Edge Runtime) — both were already in
  place from earlier passes, so no changes were needed there.

**Verification approach:** with no npm registry access in this sandbox
(confirmed again this round), I couldn't run a real `npm install && npm
run build`. Instead: full-project greps confirming no route bypasses
`lib/content.ts` for storage; a type-only isolated compile of the new
`lib/mongodb.ts` and rewritten `lib/content.ts` against stub type
declarations matching the real `mongodb` package and `@types/node` (this
caught nothing wrong, but it's a real check, not just reading the code);
and confirmation that every exported name from `lib/content.ts` is
unchanged, so nothing downstream could have silently broken. **Please
run `npm install && npm run build` yourself and set a real `MONGODB_URI`
pointing at a test cluster before deploying** — that's the one thing I
genuinely cannot verify from here.

## Adding a new service category without touching the design

Categories are just entries in `data/content.json` (or added via the admin dashboard). Every category automatically gets a themed gallery page at `/services/<id>`, a card on the services index and homepage, and is picked up by search and the sitemap — no code or design changes required.
