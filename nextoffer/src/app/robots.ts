// nextoffer/src/app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nextoffer.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/go/",           // affiliate redirects — block crawlers
          "/admin/",
          "/_next/",
          "/search?",       // avoid indexing search result URLs
          "/*?ref=",        // tracking params
          "/*?utm_",        // UTM params
          "/*?awinmid=",    // affiliate params
        ],
      },
      // Allow AI crawlers explicitly (AEO / AI search)
      { userAgent: "GPTBot",       allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot",    allow: "/" },
      { userAgent: "Applebot",     allow: "/" },
      // Block bad bots
      { userAgent: "AhrefsBot",    disallow: "/" },
      { userAgent: "SemrushBot",   disallow: "/" },
      { userAgent: "MJ12bot",      disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
