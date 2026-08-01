import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-clay">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-ink/60">The page you're looking for doesn't exist or may have moved.</p>
      <Link href="/" className="mt-6 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-fern">
        Back to Home
      </Link>
    </section>
  );
}
