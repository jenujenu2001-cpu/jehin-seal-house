/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Uploaded gallery photos are served from Cloudinary — everything
    // else (hero/section backgrounds, category fallbacks) is a local SVG
    // under /public/placeholders, which needs no remote pattern at all.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  // lib/content.ts reads data/content.json at runtime (read-only, just to
  // seed MongoDB the first time) via a path built from process.cwd(),
  // rather than a static import. Next's automatic file tracing usually
  // catches that, but being explicit guarantees data/content.json is
  // always bundled into every serverless function on Vercel — without
  // this, a missed trace would mean the very first request to a fresh
  // database fails to find anything to seed with.
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./data/content.json"]
    }
  }
};

export default nextConfig;
