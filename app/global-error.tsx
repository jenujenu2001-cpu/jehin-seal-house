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
    console.error("[root layout error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#F6F4EC", color: "#16241F" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem"
          }}
        >
          <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#C46A44" }}>Error</p>
          <h1 style={{ marginTop: "0.75rem", fontSize: "1.75rem", fontWeight: 600 }}>
            The site hit an unexpected error
          </h1>
          <p style={{ marginTop: "0.75rem", color: "rgba(22,36,31,0.65)", maxWidth: 420 }}>
            Please try again in a moment. If this keeps happening, check the server logs — it usually
            means the site's data file (data/content.json) is missing or unreadable.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              borderRadius: "9999px",
              background: "#2F5B45",
              color: "#F6F4EC",
              padding: "0.6rem 1.5rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
