import clsx from "clsx";

function buildWhatsAppLink(whatsapp: string, message?: string) {
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.65 4.55 1.78 6.43L4 29l7.73-1.73a11.9 11.9 0 0 0 4.29.8h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.59 1.03 1.08-4.47-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.44-9.9 9.9-9.9 5.46 0 9.9 4.44 9.9 9.9s-4.44 9.68-9.12 9.68zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.75-.71 2-1.4.25-.68.25-1.27.17-1.4-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

export function WhatsAppFloatingButton({
  whatsapp,
  message = "Hi, I'd like to ask about your services."
}: {
  whatsapp: string;
  message?: string;
}) {
  return (
    <a
      href={buildWhatsAppLink(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Jehin Seal House on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-moss px-4 py-3.5 text-paper shadow-lg shadow-moss/30 transition-transform hover:scale-105 hover:bg-fern focus-visible:scale-105 sm:px-5"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}

export function WhatsAppInlineButton({
  whatsapp,
  message,
  label = "Ask on WhatsApp",
  variant = "solid",
  className
}: {
  whatsapp: string;
  message?: string;
  label?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={buildWhatsAppLink(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        variant === "solid" && "bg-moss text-paper hover:bg-fern",
        variant === "outline" && "border border-moss text-moss hover:bg-moss hover:text-paper",
        variant === "ghost" && "text-moss hover:text-fern underline decoration-2 underline-offset-4",
        className
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
