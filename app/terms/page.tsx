import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-ink/75">
        <p>
          Orders placed with Jehin Seal House are confirmed once a design and quantity are agreed over WhatsApp
          or in person. Prices quoted are specific to the job described and may change if artwork, quantity, or
          material is altered after confirmation.
        </p>
        <p>
          Turnaround times are estimates and may vary with order volume. Bulk school orders should be placed
          ahead of the term where possible. Payment terms will be agreed at the time of order confirmation.
        </p>
        <p>Please review proofs carefully before approving — reprints due to approved-artwork errors may incur a charge.</p>
      </div>
    </section>
  );
}
