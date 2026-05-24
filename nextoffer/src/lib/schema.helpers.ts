// ─────────────────────────────────────────────────────────────────
// nextoffer/src/lib/schema.helpers.ts
// Schema.org JSON-LD generators for SEO, AEO & AI search visibility
// ─────────────────────────────────────────────────────────────────

import type { Deal, Provider, Review, Post, FAQItem, Comparison } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nextoffer.co.uk";

// ── Organization Schema ───────────────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "NextOffer",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "UK's leading comparison platform for broadband, web hosting, mobile SIM, VPS, VPN and business internet services.",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    sameAs: [
      "https://twitter.com/nextoffer_uk",
      "https://linkedin.com/company/nextoffer",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "hello@nextoffer.co.uk",
      availableLanguage: ["English", "Romanian"],
    },
  };
}

// ── Website Schema ────────────────────────────────────────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "NextOffer UK",
    description: "Compare UK broadband, hosting, mobile and more",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-GB",
  };
}

// ── Breadcrumb Schema ─────────────────────────────────────────────
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ── FAQ Schema (critical for AEO / featured snippets) ────────────
export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ── HowTo Schema (guides/tutorials) ──────────────────────────────
export function howToSchema(params: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string; // ISO 8601 e.g. "PT30M"
  supply?: string[];
  tool?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.totalTime && { totalTime: params.totalTime }),
    ...(params.supply && { supply: params.supply.map(s => ({ "@type": "HowToSupply", name: s })) }),
    ...(params.tool && { tool: params.tool.map(t => ({ "@type": "HowToTool", name: t })) }),
    step: params.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: { "@type": "ImageObject", url: step.image } }),
    })),
  };
}

// ── Product Schema (for deals/offers) ────────────────────────────
export function productSchema(deal: Deal, provider: Provider) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/deals/${deal.slug}#product`,
    name: deal.title,
    description: deal.highlight || provider.shortDesc,
    brand: {
      "@type": "Brand",
      name: provider.name,
    },
    offers: {
      "@type": "Offer",
      "@id": `${SITE_URL}/deals/${deal.slug}#offer`,
      url: `${SITE_URL}/go/${provider.slug}?deal=${deal.id}`,
      priceCurrency: deal.currency,
      price: deal.price.toFixed(2),
      priceValidUntil: deal.expiresAt
        ? deal.expiresAt.split("T")[0]
        : new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      availability: deal.isActive
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: provider.name,
        url: provider.website,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: provider.rating.toFixed(1),
      reviewCount: provider.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// ── Review Schema ─────────────────────────────────────────────────
export function reviewSchema(reviews: Review[], provider: Provider) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: provider.name,
    brand: { "@type": "Brand", name: provider.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: provider.rating.toFixed(1),
      reviewCount: provider.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      headline: r.title,
      reviewBody: r.body,
      datePublished: r.createdAt.split("T")[0],
      publisher: { "@id": `${SITE_URL}/#organization` },
    })),
  };
}

// ── Article / Blog Schema ─────────────────────────────────────────
export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? [post.featuredImage]
      : [`${SITE_URL}/og-default.png`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${SITE_URL}/authors/${post.author.slug}`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: "en-GB",
    ...(post.lastReviewed && {
      reviewedBy: { "@id": `${SITE_URL}/#organization` },
    }),
  };
}

// ── Comparison / ItemList Schema ──────────────────────────────────
export function comparisonListSchema(
  deals: Deal[],
  title: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    numberOfItems: deals.length,
    itemListElement: deals.map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: deal.title,
      url: `${SITE_URL}/go/${deal.providerId}?deal=${deal.id}`,
      item: {
        "@type": "Product",
        name: deal.title,
        offers: {
          "@type": "Offer",
          price: deal.price.toFixed(2),
          priceCurrency: deal.currency,
        },
      },
    })),
  };
}

// ── Local Business Schema (for UK location pages) ─────────────────
export function localBusinessSchema(location: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `NextOffer — Best Deals in ${location}`,
    url: `${SITE_URL}/best/broadband/${location.toLowerCase().replace(/\s/g, "-")}`,
    areaServed: {
      "@type": "City",
      name: location,
      containedInPlace: {
        "@type": "Country",
        name: "United Kingdom",
      },
    },
    priceRange: "£",
    description: `Compare the best broadband, hosting and mobile deals available in ${location}, UK.`,
  };
}

// ── Speakable Schema (for voice / AI search) ─────────────────────
export function speakableSchema(cssSelectors: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

// ── Render all schemas as <script> tags ───────────────────────────
export function renderSchemas(schemas: Record<string, unknown>[]): string {
  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
    )
    .join("\n");
}

// ── Helper: combine schemas for a page ───────────────────────────
export function buildPageSchemas(schemas: Record<string, unknown>[]) {
  return [organizationSchema(), websiteSchema(), ...schemas];
}
