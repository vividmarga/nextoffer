import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Cloudflare Pages compatibility ───────────────────────────
  // Do NOT set output: "standalone" for Cloudflare Pages
  // @cloudflare/next-on-pages adapts Next.js to CF Workers runtime

  // ── Image Optimization ────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cloudflare Images or unoptimized for CF Pages free tier
    unoptimized: process.env.CF_PAGES === "1",
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
    minimumCacheTTL: 86400,
  },

  // ── Experimental ─────────────────────────────────────────────
  experimental: {
    ppr: false,           // Not supported on CF Pages yet
    reactCompiler: true,
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },

  // ── Headers — Security + Performance ─────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────
  async redirects() {
    return [
      { source: "/broadband-deals", destination: "/broadband", permanent: true },
      { source: "/web-hosting",     destination: "/hosting",   permanent: true },
      { source: "/sim-only",        destination: "/mobile",    permanent: true },
    ];
  },

  // ── Rewrites — affiliate proxy ────────────────────────────────
  async rewrites() {
    return [
      {
        source: "/go/:provider",
        destination: "/api/affiliate/redirect?provider=:provider",
      },
    ];
  },

  // ── Compiler ─────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  poweredByHeader: false,
};

export default nextConfig;
