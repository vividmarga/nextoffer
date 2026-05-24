// ─────────────────────────────────────────────────────────────────
// nextoffer/src/lib/seo.metadata.ts
// Dynamic metadata generator — Next.js 15 Metadata API
// Covers all page types: homepage, category, deal, blog, compare
// ─────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import type { Vertical, Deal, Provider, Post } from "@/types";

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || "https://nextoffer.co.uk";
const SITE_NAME = "NextOffer UK";
const OG_IMAGE  = `${SITE_URL}/og-default.png`;

// ── Base metadata (applied to all pages) ─────────────────────────
export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: "NextOffer Editorial Team", url: `${SITE_URL}/about` }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "NextOffer UK",
  publisher: "NextOffer UK",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-GB": SITE_URL,
      "ro-RO": `${SITE_URL}/ro`,
    },
  },
};

// ── Homepage Metadata ─────────────────────────────────────────────
export function homepageMetadata(): Metadata {
  const title       = "Compare UK Broadband, Hosting & Mobile Deals | NextOffer";
  const description = "Find the best UK deals on broadband, web hosting, mobile SIM cards, VPS, VPN and more. Save up to £247/year with our free comparison tool. Updated daily.";

  return {
    ...BASE_METADATA,
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    keywords: [
      "compare broadband uk", "best web hosting uk", "cheap mobile sim uk",
      "broadband deals", "hosting comparison", "uk affiliate", "best vps uk",
      "compare mobile plans uk", "fibre broadband comparison",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nextoffer_uk",
      creator: "@nextoffer_uk",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

// ── Category Page Metadata ────────────────────────────────────────
const VERTICAL_META: Record<Vertical, { title: string; description: string; keywords: string[] }> = {
  broadband: {
    title: "Best Broadband Deals UK {{year}} | Compare Fibre & Cable",
    description: "Compare the UK's best broadband deals from BT, Sky, Virgin Media, TalkTalk and more. Find the cheapest fibre and fastest cable plans available in your area.",
    keywords: ["best broadband deals uk", "fibre broadband comparison", "cheapest broadband uk", "compare broadband providers", "broadband deals {{year}}"],
  },
  hosting: {
    title: "Best Web Hosting UK {{year}} | Compare Managed & Shared Plans",
    description: "Find the fastest, most reliable web hosting in the UK. Compare SiteGround, Kinsta, WP Engine, Cloudways and more — with real speed test data.",
    keywords: ["best web hosting uk", "managed wordpress hosting uk", "cheap web hosting uk", "compare hosting providers", "uk web hosting {{year}}"],
  },
  mobile: {
    title: "Best SIM Only Deals UK {{year}} | Compare Mobile Plans",
    description: "Compare the best SIM-only and pay-monthly mobile deals in the UK. Find unlimited data, 5G plans and cheap SIMs from EE, O2, Vodafone, Three and more.",
    keywords: ["best sim only deals uk", "compare mobile plans uk", "unlimited data sim uk", "5g sim deals uk", "cheap mobile uk {{year}}"],
  },
  vps: {
    title: "Best VPS Hosting UK {{year}} | Compare Cloud Servers",
    description: "Compare UK and EU VPS hosting plans from Cloudways, DigitalOcean, Vultr, Linode and more. Find the fastest, most affordable cloud servers.",
    keywords: ["best vps hosting uk", "cheap vps uk", "cloud hosting comparison", "managed vps uk", "vps server uk {{year}}"],
  },
  business: {
    title: "Best Business Broadband UK {{year}} | Compare Leased Lines",
    description: "Compare business broadband, leased lines and FTTP deals for UK businesses. Find reliable, fast connections with guaranteed SLAs.",
    keywords: ["business broadband uk", "leased line uk", "compare business internet", "fttp business uk", "business broadband comparison"],
  },
  voip: {
    title: "Best VoIP & Cloud Phone Systems UK {{year}} | Compare Plans",
    description: "Compare VoIP and cloud phone systems for UK businesses. Find the best deals on RingCentral, 8x8, Vonage and more.",
    keywords: ["best voip uk", "cloud phone system uk", "business voip comparison", "ringcentral uk", "voip providers uk {{year}}"],
  },
  vpn: {
    title: "Best VPN UK {{year}} | Compare VPN Services",
    description: "Compare the best VPN services available in the UK. Find fast, private and secure VPNs — NordVPN, ExpressVPN, Surfshark and more.",
    keywords: ["best vpn uk", "compare vpn services", "cheapest vpn uk", "nordvpn vs expressvpn", "vpn uk {{year}}"],
  },
  domains: {
    title: "Cheapest Domain Names UK {{year}} | Compare Registrars",
    description: "Compare domain name prices from UK registrars. Find the cheapest .co.uk, .com and .uk domains with free DNS and privacy protection.",
    keywords: ["cheap domain names uk", "compare domain registrars uk", "co.uk domain comparison", "namecheap vs godaddy uk", "domain registration uk"],
  },
  builders: {
    title: "Best Website Builders UK {{year}} | Compare No-Code Tools",
    description: "Compare the best website builders available in the UK. Wix, Squarespace, Webflow, Shopify — find the right platform for your needs and budget.",
    keywords: ["best website builder uk", "compare website builders", "wix vs squarespace uk", "cheap website builder uk", "ecommerce website builder uk"],
  },
  ai: {
    title: "Best AI Tools UK {{year}} | Compare SaaS & AI Platforms",
    description: "Compare the best AI writing, coding and productivity tools. Find the best value SaaS plans for UK individuals and businesses.",
    keywords: ["best ai tools uk", "compare ai platforms", "chatgpt alternatives uk", "ai saas comparison uk", "ai productivity tools {{year}}"],
  },
  banks: {
    title: "Cele Mai Bune Bănci România {{year}} | Compară Oferte",
    description: "Compară ofertele băncilor din România. Revolut, ING, BCR, BRD — găsește cel mai bun cont curent sau depozit.",
    keywords: ["banci romania comparatie", "revolut romania", "cel mai bun cont curent romania", "ing romania oferte"],
  },
  insurance: {
    title: "Compare Insurance UK & Romania {{year}}",
    description: "Compare insurance deals for UK and Romanian consumers. Find the best car, home and travel insurance.",
    keywords: ["compare insurance uk", "cheap insurance uk", "insurance comparison"],
  },
  energy: {
    title: "Compare Energy Deals UK {{year}} | Gas & Electricity",
    description: "Compare gas and electricity deals from UK energy suppliers. Find the cheapest tariffs from Octopus, OVO, E.ON and more.",
    keywords: ["compare energy uk", "cheap electricity uk", "energy comparison", "octopus energy deals"],
  },
  travel: {
    title: "Compare Travel Deals UK & Romania {{year}}",
    description: "Compare travel and holiday deals. Find the best prices on hotels, flights and holiday packages.",
    keywords: ["compare travel deals", "cheap hotels uk", "travel comparison"],
  },
  crypto: {
    title: "Best Crypto Exchanges UK {{year}} | Compare Platforms",
    description: "Compare crypto trading platforms in the UK. Find the lowest fees on Coinbase, Binance, Kraken and more.",
    keywords: ["best crypto exchange uk", "compare crypto platforms", "coinbase vs binance uk", "cheap crypto trading uk"],
  },
};

export function categoryMetadata(vertical: Vertical): Metadata {
  const year = new Date().getFullYear().toString();
  const raw  = VERTICAL_META[vertical];
  const title       = raw.title.replace("{{year}}", year);
  const description = raw.description.replace("{{year}}", year);
  const keywords    = raw.keywords.map(k => k.replace("{{year}}", year));
  const url         = `${SITE_URL}/${vertical}`;

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: `${SITE_URL}/og/${vertical}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nextoffer_uk",
      title,
      description,
      images: [`${SITE_URL}/og/${vertical}.png`],
    },
  };
}

// ── Deal Page Metadata ────────────────────────────────────────────
export function dealMetadata(deal: Deal, provider: Provider): Metadata {
  const title       = `${provider.name} Review ${new Date().getFullYear()} — Is It Worth It? | NextOffer`;
  const description = `${provider.name}: from ${deal.currency === "GBP" ? "£" : "RON"}${deal.price}/mo. ${deal.highlight || provider.shortDesc} Expert review, pros & cons, and best alternatives.`;
  const url         = `${SITE_URL}/reviews/${provider.slug}`;

  return {
    ...BASE_METADATA,
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title,
      description,
      publishedTime: deal.createdAt,
      modifiedTime:  deal.updatedAt,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Blog Post Metadata ────────────────────────────────────────────
export function postMetadata(post: Post): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    ...BASE_METADATA,
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags,
    alternates: { canonical: post.canonicalUrl || url },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [`${SITE_URL}/authors/${post.author.slug}`],
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630 }]
        : [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
  };
}

// ── Comparison Page Metadata ──────────────────────────────────────
export function comparisonMetadata(providerA: string, providerB: string, vertical: Vertical): Metadata {
  const year  = new Date().getFullYear();
  const title = `${providerA} vs ${providerB} ${year} — Which is Better? | NextOffer`;
  const description = `${providerA} vs ${providerB}: detailed comparison of pricing, speed, features and value. Find out which ${vertical} provider is right for you in ${year}.`;
  const slug  = `${providerA.toLowerCase().replace(/\s/g, "-")}-vs-${providerB.toLowerCase().replace(/\s/g, "-")}`;
  const url   = `${SITE_URL}/compare/${slug}`;

  return {
    ...BASE_METADATA,
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Programmatic SEO — Best In Location ──────────────────────────
export function bestInLocationMetadata(vertical: Vertical, location: string): Metadata {
  const year  = new Date().getFullYear();
  const title = `Best ${vertical.charAt(0).toUpperCase() + vertical.slice(1)} Deals in ${location} ${year} | NextOffer`;
  const description = `Compare the best ${vertical} deals available in ${location}. We check every provider in your postcode area to find you the cheapest, fastest options in ${year}.`;
  const url   = `${SITE_URL}/best/${vertical}/${location.toLowerCase().replace(/\s/g, "-")}`;

  return {
    ...BASE_METADATA,
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
