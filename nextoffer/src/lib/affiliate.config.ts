// ─────────────────────────────────────────────────────────────────
// nextoffer/src/lib/affiliate.config.ts
// Affiliate network configuration, tracking & commission data
// ─────────────────────────────────────────────────────────────────

import type { AffiliateNetwork, Vertical } from "@/types";

// ── Publisher IDs (set via env vars) ─────────────────────────────
export const PUBLISHER_IDS = {
  awin:        process.env.AWIN_PUBLISHER_ID!,
  impact:      process.env.IMPACT_PUBLISHER_ID!,
  shareasale:  process.env.SHAREASALE_AFFILIATE_ID!,
  performant:  process.env.PERFORMANT_AFFILIATE_ID!, // 2Performant RO
} as const;

// ── Network base URLs ─────────────────────────────────────────────
export const NETWORK_CONFIG: Record<AffiliateNetwork, {
  name: string;
  baseUrl: string;
  cookieDuration: number; // days
  market: string[];
  trackingParam: string;
}> = {
  awin: {
    name: "Awin",
    baseUrl: "https://www.awin1.com/cread.php",
    cookieDuration: 30,
    market: ["uk", "global"],
    trackingParam: "awinmid",
  },
  impact: {
    name: "Impact",
    baseUrl: "https://impact.go2cloud.org/aff_c",
    cookieDuration: 30,
    market: ["uk", "us", "global"],
    trackingParam: "offer_id",
  },
  shareasale: {
    name: "ShareASale",
    baseUrl: "https://www.shareasale.com/r.cfm",
    cookieDuration: 30,
    market: ["uk", "us"],
    trackingParam: "merchantID",
  },
  "2performant": {
    name: "2Performant",
    baseUrl: "https://event.2performant.com/events/click",
    cookieDuration: 30,
    market: ["ro"],
    trackingParam: "ad_type",
  },
  direct: {
    name: "Direct",
    baseUrl: "",
    cookieDuration: 0,
    market: ["uk", "ro"],
    trackingParam: "",
  },
};

// ── Commission estimates by vertical (GBP) ───────────────────────
export const COMMISSION_ESTIMATES: Record<Vertical, {
  cpa: { min: number; max: number; avg: number };
  type: "cpa" | "cpl" | "revenue_share";
  notes: string;
}> = {
  hosting: {
    cpa: { min: 50, max: 200, avg: 80 },
    type: "cpa",
    notes: "High EPC. SiteGround £100+, Kinsta £50-200/sale",
  },
  vps: {
    cpa: { min: 80, max: 250, avg: 120 },
    type: "cpa",
    notes: "Best vertical. Cloudways, DigitalOcean, Vultr",
  },
  broadband: {
    cpa: { min: 15, max: 80, avg: 35 },
    type: "cpa",
    notes: "Volume play. BT £40, Sky £35, Virgin £45",
  },
  mobile: {
    cpa: { min: 20, max: 80, avg: 40 },
    type: "cpa",
    notes: "SIM-only £15-25, handsets £50-80",
  },
  business: {
    cpa: { min: 40, max: 150, avg: 80 },
    type: "cpl",
    notes: "Leased lines high value. B2B longer funnel",
  },
  voip: {
    cpa: { min: 30, max: 100, avg: 55 },
    type: "cpa",
    notes: "RingCentral, 8x8, Vonage on Impact",
  },
  vpn: {
    cpa: { min: 10, max: 45, avg: 22 },
    type: "cpa",
    notes: "NordVPN 40%, ExpressVPN 35% rev share",
  },
  domains: {
    cpa: { min: 5, max: 25, avg: 12 },
    type: "cpa",
    notes: "Low CPA, high volume. Upsell hosting",
  },
  builders: {
    cpa: { min: 20, max: 80, avg: 40 },
    type: "cpa",
    notes: "Wix, Squarespace, Webflow on Impact",
  },
  ai: {
    cpa: { min: 15, max: 60, avg: 30 },
    type: "revenue_share",
    notes: "Jasper, Copy.ai, Notion AI — growing",
  },
  banks: {
    cpa: { min: 30, max: 120, avg: 60 },
    type: "cpl",
    notes: "RO: Revolut, ING, BCR on 2Performant",
  },
  insurance: {
    cpa: { min: 20, max: 80, avg: 45 },
    type: "cpl",
    notes: "RO: Allianz, Generali. UK: CompareTheMarket",
  },
  energy: {
    cpa: { min: 25, max: 70, avg: 40 },
    type: "cpa",
    notes: "UK: Octopus, OVO, E.ON on Awin",
  },
  travel: {
    cpa: { min: 10, max: 50, avg: 25 },
    type: "revenue_share",
    notes: "Hotels.com 4%, Booking.com 4%",
  },
  crypto: {
    cpa: { min: 20, max: 150, avg: 60 },
    type: "cpa",
    notes: "Coinbase, Binance, Kraken high CPA",
  },
};

// ── Known affiliate programs ──────────────────────────────────────
export const AFFILIATE_PROGRAMS = {
  // Broadband — Awin UK
  bt:           { network: "awin" as AffiliateNetwork, merchantId: "7154",  vertical: "broadband" as Vertical },
  sky:          { network: "awin" as AffiliateNetwork, merchantId: "2103",  vertical: "broadband" as Vertical },
  virginmedia:  { network: "awin" as AffiliateNetwork, merchantId: "1438",  vertical: "broadband" as Vertical },
  talktalk:     { network: "awin" as AffiliateNetwork, merchantId: "6437",  vertical: "broadband" as Vertical },
  plusnet:      { network: "awin" as AffiliateNetwork, merchantId: "4297",  vertical: "broadband" as Vertical },
  // Hosting — Awin + Impact + ShareASale
  siteground:   { network: "awin" as AffiliateNetwork, merchantId: "6094",  vertical: "hosting" as Vertical },
  kinsta:       { network: "impact" as AffiliateNetwork, merchantId: "1899611", vertical: "hosting" as Vertical },
  cloudways:    { network: "impact" as AffiliateNetwork, merchantId: "1760923", vertical: "hosting" as Vertical },
  wpengine:     { network: "shareasale" as AffiliateNetwork, merchantId: "41438", vertical: "hosting" as Vertical },
  bluehost:     { network: "impact" as AffiliateNetwork, merchantId: "1788453", vertical: "hosting" as Vertical },
  hostinger:    { network: "impact" as AffiliateNetwork, merchantId: "2165835", vertical: "hosting" as Vertical },
  // VPN
  nordvpn:      { network: "impact" as AffiliateNetwork, merchantId: "1875474", vertical: "vpn" as Vertical },
  expressvpn:   { network: "impact" as AffiliateNetwork, merchantId: "1457242", vertical: "vpn" as Vertical },
  surfshark:    { network: "impact" as AffiliateNetwork, merchantId: "1919484", vertical: "vpn" as Vertical },
  // Mobile
  idmobile:     { network: "awin" as AffiliateNetwork, merchantId: "14869", vertical: "mobile" as Vertical },
  voxi:         { network: "awin" as AffiliateNetwork, merchantId: "19756", vertical: "mobile" as Vertical },
  // Domains
  namecheap:    { network: "impact" as AffiliateNetwork, merchantId: "1876462", vertical: "domains" as Vertical },
  godaddy:      { network: "awin" as AffiliateNetwork, merchantId: "5468",  vertical: "domains" as Vertical },
  // Builders
  wix:          { network: "impact" as AffiliateNetwork, merchantId: "2184416", vertical: "builders" as Vertical },
  squarespace:  { network: "impact" as AffiliateNetwork, merchantId: "1439", vertical: "builders" as Vertical },
} as const;

// ── URL Builder ───────────────────────────────────────────────────
export function buildAffiliateUrl(
  programKey: keyof typeof AFFILIATE_PROGRAMS,
  destinationUrl: string,
  clickRef?: string
): string {
  const program = AFFILIATE_PROGRAMS[programKey];
  const pubId = PUBLISHER_IDS[program.network];

  const ref = clickRef || `nextoffer_${program.vertical}_${Date.now()}`;

  switch (program.network) {
    case "awin":
      return `https://www.awin1.com/cread.php?awinmid=${program.merchantId}&awinaffid=${pubId}&clickref=${ref}&p=${encodeURIComponent(destinationUrl)}`;

    case "impact":
      return `https://impact.go2cloud.org/aff_c?offer_id=${program.merchantId}&aff_id=${pubId}&url=${encodeURIComponent(destinationUrl)}&aff_sub=${ref}`;

    case "shareasale":
      return `https://www.shareasale.com/r.cfm?b=0&u=${pubId}&m=${program.merchantId}&urllink=${encodeURIComponent(destinationUrl)}&afftrack=${ref}`;

    case "2performant":
      return `https://event.2performant.com/events/click?ad_type=banner&aff_code=${pubId}&unique=${ref}&redirect_to=${encodeURIComponent(destinationUrl)}`;

    default:
      return destinationUrl;
  }
}

// ── Internal redirect URL (hides affiliate URLs from crawlers) ────
export function buildInternalRedirect(
  programKey: keyof typeof AFFILIATE_PROGRAMS,
  dealId: string
): string {
  return `/go/${programKey}?deal=${dealId}`;
}

// ── Tracking ──────────────────────────────────────────────────────
export async function trackAffiliateClick(params: {
  dealId: string;
  providerId: string;
  vertical: Vertical;
  network: AffiliateNetwork;
  sessionId: string;
  referrer?: string;
}): Promise<void> {
  try {
    await fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        clickedAt: new Date().toISOString(),
      }),
      keepalive: true, // fire-and-forget even on page unload
    });
  } catch {
    // Silent fail — never block user navigation for tracking
  }
}

// ── GDPR-safe click session ID ─────────────────────────────────────
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("nextoffer_sid");
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("nextoffer_sid", id);
  }
  return id;
}

// ── Disclosure text (FTC/ASA compliant) ───────────────────────────
export const AFFILIATE_DISCLOSURE = {
  short: "We may earn a commission when you click links on this page.",
  full: `NextOffer participates in affiliate programs including Awin, Impact Radius, and ShareASale. 
  When you click on certain links on our site and make a purchase or sign up for a service, 
  we may receive a commission. This doesn't affect the price you pay and our editorial opinions 
  remain independent. We only recommend services we genuinely believe offer good value to UK consumers.`,
  badgeLabel: "Affiliate link",
};
