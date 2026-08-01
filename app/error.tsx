"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-clay">Error</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-3 text-ink/60">
        This page hit an unexpected error. You can try again, or head back to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-paper hover:bg-fern"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink hover:border-moss hover:text-moss"
        >
          Back to Home
        </a>
      </div>
    </section>
  );
}
