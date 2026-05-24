import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────────────────
      fontFamily: {
        display: ["Syne", ...fontFamily.sans],
        body:    ["DM Sans", ...fontFamily.sans],
        mono:    ["JetBrains Mono", ...fontFamily.mono],
      },

      // ── Color Palette ──────────────────────────────────────
      colors: {
        brand: {
          teal:    "#00D4AA",
          "teal-dark": "#00BFA0",
          purple:  "#9B8FFF",
          amber:   "#FFB547",
          navy:    "#05060F",
          "navy-2": "#0D0E1A",
          "navy-3": "#141527",
          slate:   "#8B8FA8",
          "slate-2": "#3A3D52",
          cream:   "#F5F4EF",
          white:   "#FFFFFF",
        },
        // Category-specific accents
        cat: {
          broadband: "#00D4AA",
          hosting:   "#9B8FFF",
          mobile:    "#FFB547",
          vps:       "#FF6B6B",
          business:  "#4ECDC4",
          voip:      "#45B7D1",
          vpn:       "#96CEB4",
          domains:   "#FFEAA7",
          builders:  "#DDA0DD",
          ai:        "#FF9FF3",
        },
      },

      // ── Spacing ────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "container": "1200px",
      },

      // ── Border Radius ──────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ── Typography ─────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "display-sm": ["clamp(1.75rem, 3vw, 2.25rem)", { lineHeight: "1.2" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05" }],
        "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1" }],
      },

      // ── Shadows ────────────────────────────────────────────
      boxShadow: {
        "card":       "0 4px 24px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
        "card-hover": "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)",
        "glow-teal":  "0 0 30px rgba(0,212,170,0.3)",
        "glow-purple":"0 0 30px rgba(155,143,255,0.3)",
        "glow-amber": "0 0 30px rgba(255,181,71,0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },

      // ── Animations ─────────────────────────────────────────
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "counter": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
      animation: {
        "fade-up":        "fade-up 0.6s ease both",
        "fade-up-slow":   "fade-up 0.9s ease both",
        "fade-in":        "fade-in 0.4s ease both",
        "float":          "float 6s ease-in-out infinite",
        "float-delayed":  "float 6s ease-in-out infinite 2s",
        "float-delayed-2":"float 6s ease-in-out infinite 4s",
        "pulse-glow":     "pulse-glow 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "slide-in-right": "slide-in-right 0.5s ease both",
        "shimmer":        "shimmer 2s linear infinite",
        "blink":          "blink 0.9s step-end infinite",
      },

      // ── Background gradients ────────────────────────────────
      backgroundImage: {
        "gradient-brand":  "linear-gradient(135deg, #00D4AA 0%, #9B8FFF 50%, #FFB547 100%)",
        "gradient-dark":   "linear-gradient(180deg, #0D0E1A 0%, #05060F 100%)",
        "gradient-card":   "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "gradient-teal":   "linear-gradient(135deg, #00D4AA, #00BFA0)",
        "gradient-purple": "linear-gradient(135deg, #9B8FFF, #7B6FEF)",
        "noise":           "url('/noise.png')",
      },

      // ── Backdrop blur ──────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },

      // ── Screens ────────────────────────────────────────────
      screens: {
        "xs": "480px",
        "3xl": "1600px",
      },

      // ── Z-index ────────────────────────────────────────────
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    // Custom plugin for glassmorphism utilities
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".glass": {
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
        ".glass-strong": {
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        },
        ".text-gradient-brand": {
          background: "linear-gradient(135deg, #00D4AA 0%, #9B8FFF 50%, #FFB547 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};

export default config;
