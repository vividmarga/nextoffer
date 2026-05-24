// ─────────────────────────────────────────────────────────────────
// nextoffer/src/types/index.ts
// Core TypeScript types for the NextOffer UK affiliate platform
// ─────────────────────────────────────────────────────────────────

// ── Verticals / Categories ────────────────────────────────────────
export type Vertical =
  | "broadband"
  | "hosting"
  | "mobile"
  | "vps"
  | "business"
  | "voip"
  | "vpn"
  | "domains"
  | "builders"
  | "ai"
  | "banks"        // RO
  | "insurance"    // RO
  | "energy"       // RO/UK
  | "travel"       // RO/UK
  | "crypto";      // RO/UK

export type Market = "uk" | "ro";

export type AffiliateNetwork =
  | "awin"
  | "impact"
  | "shareasale"
  | "2performant"
  | "direct";

// ── Provider ──────────────────────────────────────────────────────
export interface Provider {
  id: string;
  slug: string;
  name: string;
  logo: string;
  website: string;
  vertical: Vertical;
  market: Market[];
  rating: number;          // 0–5
  reviewCount: number;
  trustScore: number;      // 0–100 internal score
  description: string;
  shortDesc: string;
  founded?: number;
  headquarters?: string;
  featured: boolean;
  verified: boolean;       // manually verified affiliate link
  updatedAt: string;       // ISO date
}

// ── Deal / Offer ──────────────────────────────────────────────────
export interface Deal {
  id: string;
  providerId: string;
  provider: Provider;
  title: string;
  slug: string;
  vertical: Vertical;
  market: Market;

  // Pricing
  price: number;           // monthly GBP or RON
  currency: "GBP" | "RON";
  originalPrice?: number;
  contractLength?: number; // months
  setupFee?: number;
  setupFeeWaived?: boolean;

  // Specs (flexible per vertical)
  specs: Record<string, string | number | boolean>;

  // Affiliate
  affiliateUrl: string;
  affiliateNetwork: AffiliateNetwork;
  affiliateProgramId?: string;
  commissionType: "cpa" | "cpl" | "revenue_share";
  commissionValue?: number; // GBP

  // Display
  badge?: string;          // "Best Value" | "Most Popular" | "Editor's Pick" etc.
  badgeColor?: string;
  highlight?: string;      // short promo text
  promoCode?: string;
  promoExpiry?: string;    // ISO date

  // Status
  isActive: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  expiresAt?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt: string;
  updatedAt: string;
}

// ── Broadband-specific specs ──────────────────────────────────────
export interface BroadbandSpecs {
  downloadSpeed: number;   // Mbps
  uploadSpeed: number;     // Mbps
  technology: "FTTP" | "FTTC" | "Cable" | "ADSL" | "G.fast" | "Fixed Wireless";
  unlimited: boolean;
  dataAllowance?: number;  // GB, if not unlimited
  averageSpeed?: number;   // Ofcom-style average
  eveningSpeed?: number;
  minSpeed?: number;
  router: boolean;
  routerModel?: string;
  staticIp: boolean;
  ipv6: boolean;
  ukSupport: boolean;
}

// ── Hosting-specific specs ────────────────────────────────────────
export interface HostingSpecs {
  type: "shared" | "managed-wp" | "vps" | "dedicated" | "cloud" | "reseller";
  storage: number;         // GB
  storageType: "SSD" | "NVMe" | "HDD";
  bandwidth: "unlimited" | number; // GB
  domains: number | "unlimited";
  freeSSL: boolean;
  freeDomain: boolean;
  cpanel: boolean;
  wordpress: boolean;
  uptime: number;          // percentage e.g. 99.9
  datacenterUK: boolean;
  backups: boolean;
  backupFrequency?: string;
  cdnIncluded: boolean;
  emailAccounts: number | "unlimited";
  phpVersions: string[];
  mysqlDatabases: number | "unlimited";
  supportLevel: "email" | "chat" | "phone" | "24/7";
}

// ── Mobile-specific specs ─────────────────────────────────────────
export interface MobileSpecs {
  type: "sim-only" | "pay-monthly" | "pay-as-you-go";
  data: number | "unlimited"; // GB
  minutes: number | "unlimited";
  texts: number | "unlimited";
  fiveG: boolean;
  fourG: boolean;
  roaming: boolean;
  roamingCountries?: number;
  network: "EE" | "O2" | "Vodafone" | "Three" | "MVNO";
  esim: boolean;
  contractLength: number;  // months
  handset?: string;
}

// ── Review ────────────────────────────────────────────────────────
export interface Review {
  id: string;
  providerId: string;
  dealId?: string;
  author: string;
  authorVerified: boolean;
  rating: number;          // 1–5
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  vertical: Vertical;
  market: Market;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  // Schema.org
  schemaType: "Review";
}

// ── Blog Post / Guide ─────────────────────────────────────────────
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;         // MDX
  category: Vertical | "general" | "guides" | "news";
  market: Market[];
  author: Author;
  featuredImage?: string;
  tags: string[];
  readingTime: number;     // minutes
  publishedAt: string;
  updatedAt: string;
  featured: boolean;

  // SEO
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  noIndex: boolean;

  // AEO
  faqItems?: FAQItem[];
  tableOfContents?: TocItem[];
  keyTakeaways?: string[];
  lastReviewed?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar?: string;
  expertise: Vertical[];
  linkedin?: string;
  twitter?: string;
}

// ── FAQ ───────────────────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
  category?: Vertical;
}

// ── Table of Contents ─────────────────────────────────────────────
export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
  children?: TocItem[];
}

// ── Comparison ────────────────────────────────────────────────────
export interface Comparison {
  id: string;
  slug: string;            // e.g. "bt-vs-sky-broadband"
  title: string;
  vertical: Vertical;
  market: Market;
  providerA: Provider;
  providerB: Provider;
  dealA?: Deal;
  dealB?: Deal;
  verdict: string;
  summary: string;
  winner?: "a" | "b" | "tie";
  publishedAt: string;
  updatedAt: string;
}

// ── Affiliate Click Tracking ──────────────────────────────────────
export interface AffiliateClick {
  id: string;
  dealId: string;
  providerId: string;
  vertical: Vertical;
  network: AffiliateNetwork;
  sessionId: string;
  userId?: string;
  referrer?: string;
  userAgent?: string;
  ipCountry?: string;
  clickedAt: string;
  converted: boolean;
  conversionValue?: number;
  conversionAt?: string;
}

// ── SEO Metadata ──────────────────────────────────────────────────
export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  openGraph: {
    title: string;
    description: string;
    image?: string;
    type: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
    image?: string;
  };
  schema?: Record<string, unknown>[];
}

// ── Programmatic SEO Page ─────────────────────────────────────────
export interface ProgSeoPage {
  type: "best-in-location" | "compare" | "provider-review" | "deal-category";
  vertical: Vertical;
  location?: string;       // "Manchester" | "London" etc.
  providerA?: string;
  providerB?: string;
  deals: Deal[];
  meta: SeoMeta;
  faq: FAQItem[];
  updatedAt: string;
}

// ── UK Location (for coverage maps) ──────────────────────────────
export interface UKLocation {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  region: string;
  postcodePrefixes: string[];
  population?: number;
  availableProviders: string[]; // provider IDs
}

// ── API Responses ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
  };
}

// ── Filter / Sort ─────────────────────────────────────────────────
export interface DealFilters {
  vertical?: Vertical;
  market?: Market;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  network?: AffiliateNetwork;
  featured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "commission" | "newest";
  search?: string;
  page?: number;
  perPage?: number;
}

// ── Config ────────────────────────────────────────────────────────
export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  locale: string;
  market: Market;
  currency: "GBP" | "RON";
  affiliateNetworks: AffiliateNetwork[];
  ogImage: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}
