import type { Metadata } from "next";
import SearchExplorer from "@/components/SearchExplorer";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Services",
  description: "Search all printing and custom gift services offered by Jehin Seal House."
};

export default async function SearchPage() {
  const content = await getContent();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow text-moss">Find a Service</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Search</h1>
      <p className="mt-3 max-w-xl text-ink/70">Looking for something specific? Search by name — tie, badge, bottle, cup, frame, logo, and more.</p>

      <div className="mt-8">
        <SearchExplorer categories={content.categories} />
      </div>
    </section>
  );
}
