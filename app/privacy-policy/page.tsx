import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-ink/75">
        <p>
          Jehin Seal House collects only the information customers choose to share with us directly, such as
          through WhatsApp messages or in person at our shop on Stanley Road, Jaffna. We use this information
          solely to process orders, respond to enquiries, and provide quotes.
        </p>
        <p>
          We do not sell, rent, or share customer information with third parties. Any design files or photos
          sent to us for printing are used only for the purpose of completing that order.
        </p>
        <p>If you have questions about how your information is handled, please contact us on WhatsApp.</p>
      </div>
    </section>
  );
}
