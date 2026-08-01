import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EC",
        ink: "#16241F",
        moss: "#2F5B45",
        fern: "#4C8063",
        sage: "#B7C9AE",
        clay: "#C46A44",
        mist: "#E7EFE6",
        charcoal: "#0F1512",
        charcoal2: "#1A231D",
        amber: "#E0A458"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        halftone:
          "radial-gradient(circle, rgba(22,36,31,0.12) 1px, transparent 1px)",
        leaf: "radial-gradient(circle at 20% 20%, rgba(76,128,99,0.15), transparent 40%), radial-gradient(circle at 80% 60%, rgba(196,106,68,0.10), transparent 45%)"
      },
      backgroundSize: {
        halftone8: "8px 8px"
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        floatX: {
          "0%, 100%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(10px)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        floatY: "floatY 6s ease-in-out infinite",
        floatYSlow: "floatY 9s ease-in-out infinite",
        floatX: "floatX 7s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        marqueeSlow: "marquee 70s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        spinSlow: "spinSlow 18s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
