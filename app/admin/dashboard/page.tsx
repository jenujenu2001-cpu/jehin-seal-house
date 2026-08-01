import Link from "next/link";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const content = await getContent();
  const totalImages = content.categories.reduce((sum, c) => sum + c.images.length, 0);
  const recentUploads = content.categories
    .flatMap((c) => c.images.map((img) => ({ ...img, category: c.name, categoryId: c.id })))
    .slice(-6)
    .reverse();

  const stats = [
    { label: "Total Categories", value: content.categories.length },
    { label: "Total Images", value: totalImages },
    { label: "Testimonials", value: content.testimonials.length },
    { label: "Empty Galleries", value: content.categories.filter((c) => c.images.length === 0).length }
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">A quick look at what's on the site right now.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-3xl font-semibold text-ink">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-paper p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">Recent Uploads</h2>
          {recentUploads.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">No images uploaded yet — add some from the Categories tab.</p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {recentUploads.map((img) => (
                <Link key={img.id} href={`/admin/categories/${img.categoryId}`} className="group relative aspect-square overflow-hidden rounded-lg border border-ink/10">
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/admin/categories" className="font-medium text-moss hover:text-fern">Manage Categories &amp; Gallery →</Link></li>
            <li><Link href="/admin/settings" className="font-medium text-moss hover:text-fern">Business Info &amp; Homepage →</Link></li>
            <li><Link href="/" target="_blank" className="font-medium text-moss hover:text-fern">Preview Website ↗</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
