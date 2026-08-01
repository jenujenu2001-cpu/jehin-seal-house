import AnimatedSection from "./AnimatedSection";

const STEPS = [
  {
    title: "Order Placed",
    detail: "Send your idea, design, or measurements over WhatsApp.",
    path: "M4 7h16M4 12h10M4 17h13"
  },
  {
    title: "Design Created",
    detail: "Our team prepares or refines the artwork for print.",
    path: "M12 3v3M4.5 7.5 6.6 9.6M3 15h3M4.5 22.5 6.6 20.4M12 21v-3M19.5 22.5l-2.1-2.1M21 15h-3M19.5 7.5l-2.1 2.1"
  },
  {
    title: "Printing",
    detail: "Printed and finished in-house on the right equipment for the job.",
    path: "M6 9V4h12v5M4 9h16v7H4z M7 16h10v5H7z"
  },
  {
    title: "Quality Check",
    detail: "Every piece is checked for colour, alignment, and finish.",
    path: "m4 12 5 5L20 6"
  },
  {
    title: "Delivery",
    detail: "Ready for pickup, or delivered for bulk and school orders.",
    path: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
  }
];

export default function ProcessTimeline() {
  return (
    <div className="relative mt-14">
      <div className="absolute left-0 right-0 top-7 hidden h-px bg-ink/15 md:block" aria-hidden="true" />
      <div className="grid gap-10 md:grid-cols-5 md:gap-6">
        {STEPS.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1} className="relative flex flex-col items-center text-center md:items-start md:text-left">
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-moss text-paper shadow-lg shadow-moss/20">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d={step.path} />
              </svg>
            </span>
            <p className="mt-4 font-mono text-xs text-clay">Step {i + 1}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 max-w-[220px] text-sm leading-relaxed text-ink/65">{step.detail}</p>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
