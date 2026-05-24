// ─────────────────────────────────────────────────────────────────
// nextoffer/src/app/sitemap.ts
// Dynamic sitemap — covers all static + programmatic pages
// Next.js 15 Metadata API — auto-submitted to Google + Bing
// ─────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nextoffer.co.uk";

const VERTICALS = [
  "broadband", "hosting", "mobile", "vps", "vpn",
  "business", "voip", "domains", "builders", "ai",
];

const UK_CITIES = [
  "london", "manchester", "birmingham", "leeds", "glasgow",
  "liverpool", "bristol", "sheffield", "edinburgh", "cardiff",
  "nottingham", "leicester", "cambridge", "oxford", "brighton",
  "southampton", "newcastle", "belfast", "coventry", "reading",
  "hull", "exeter", "york", "bath", "milton-keynes",
  "portsmouth", "stoke-on-trent", "wolverhampton", "swansea", "aberdeen",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/deals`,   lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ai-picks`,lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`,    lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/guides`,  lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/about`,   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // ── Category pages ────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = VERTICALS.map(v => ({
    url: `${SITE_URL}/${v}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // ── Best-of pages (all verticals × cities) ────────────────────
  const bestPages: MetadataRoute.Sitemap = VERTICALS.flatMap(v =>
    UK_CITIES.map(city => ({
      url: `${SITE_URL}/best/${v}/${city}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // ── Dynamic: providers, deals, posts (from Supabase) ─────────
  let providerPages: MetadataRoute.Sitemap = [];
  let dealPages:     MetadataRoute.Sitemap = [];
  let postPages:     MetadataRoute.Sitemap = [];

  try {
    const { getSitemapData } = await import("@/lib/supabase.client");
    const { providers, deals, posts } = await getSitemapData();

    providerPages = providers.map(p => ({
      url: `${SITE_URL}/reviews/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    dealPages = deals.map(d => ({
      url: `${SITE_URL}/deals/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

    postPages = posts.map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase unavailable at build time — continue with static pages
    console.warn("[sitemap] Supabase unavailable, skipping dynamic pages");
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...bestPages,
    ...providerPages,
    ...dealPages,
    ...postPages,
  ];
}
