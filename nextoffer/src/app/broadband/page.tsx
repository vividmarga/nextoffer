// ─────────────────────────────────────────────────────────────────
// nextoffer/src/app/broadband/page.tsx
// Broadband category page — ISR, Schema.org, comparison table,
// live filters, affiliate CTAs, FAQ/AEO blocks
// ─────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { categoryMetadata } from "@/lib/seo.metadata";
import {
  faqSchema, comparisonListSchema, breadcrumbSchema, buildPageSchemas
} from "@/lib/schema.helpers";
import type { Deal } from "@/types";

// ── ISR: revalidate every 4 hours ────────────────────────────────
export const revalidate = 14400;

// ── Metadata ──────────────────────────────────────────────────────
export const metadata: Metadata = categoryMetadata("broadband");

// ── Mock data (replace with Supabase fetch in production) ─────────
const BROADBAND_DEALS: Deal[] = [
  {
    id: "bt-ff900-2024",
    providerId: "bt",
    provider: {
      id: "bt", slug: "bt", name: "BT", logo: "/logos/bt.svg",
      website: "https://bt.com", vertical: "broadband", market: ["uk"],
      rating: 4.2, reviewCount: 3847, trustScore: 82,
      description: "UK's largest broadband provider with nationwide coverage.",
      shortDesc: "Full Fibre 900 — fastest residential broadband in the UK",
      featured: true, verified: true, updatedAt: "2026-05-01T00:00:00Z",
    },
    title: "BT Full Fibre 900",
    slug: "bt-full-fibre-900",
    vertical: "broadband",
    market: "uk",
    price: 34.99,
    currency: "GBP",
    originalPrice: 49.99,
    contractLength: 24,
    setupFee: 0,
    setupFeeWaived: true,
    specs: {
      downloadSpeed: 900, uploadSpeed: 110,
      technology: "FTTP", unlimited: true,
      router: true, routerModel: "Smart Hub 2",
      staticIp: false, ipv6: true, ukSupport: true,
    },
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7154&awinaffid=YOURPUBID&p=https%3A%2F%2Fwww.bt.com",
    affiliateNetwork: "awin",
    commissionType: "cpa", commissionValue: 40,
    badge: "Most Popular", badgeColor: "#00D4AA",
    highlight: "UK's fastest widely available fibre broadband",
    isActive: true, isFeatured: true, isExclusive: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "sky-fibre-max-2024",
    providerId: "sky",
    provider: {
      id: "sky", slug: "sky", name: "Sky", logo: "/logos/sky.svg",
      website: "https://sky.com", vertical: "broadband", market: ["uk"],
      rating: 4.0, reviewCount: 5120, trustScore: 78,
      description: "Sky broadband with great value fibre plans.",
      shortDesc: "Superfast & Ultrafast fibre with Sky TV bundles available",
      featured: true, verified: true, updatedAt: "2026-05-01T00:00:00Z",
    },
    title: "Sky Fibre Max",
    slug: "sky-fibre-max",
    vertical: "broadband",
    market: "uk",
    price: 28.00,
    currency: "GBP",
    originalPrice: 40.00,
    contractLength: 18,
    setupFee: 0,
    setupFeeWaived: true,
    specs: {
      downloadSpeed: 500, uploadSpeed: 60,
      technology: "FTTC", unlimited: true,
      router: true, routerModel: "Sky Hub",
      staticIp: false, ipv6: false, ukSupport: true,
    },
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=2103&awinaffid=YOURPUBID&p=https%3A%2F%2Fwww.sky.com",
    affiliateNetwork: "awin",
    commissionType: "cpa", commissionValue: 35,
    badge: "Best Value", badgeColor: "#FFB547",
    highlight: "Cheapest unlimited fibre under £30/month",
    isActive: true, isFeatured: true, isExclusive: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "virgin-m500-2024",
    providerId: "virgin",
    provider: {
      id: "virgin", slug: "virgin-media", name: "Virgin Media", logo: "/logos/virgin.svg",
      website: "https://virginmedia.com", vertical: "broadband", market: ["uk"],
      rating: 4.3, reviewCount: 4221, trustScore: 80,
      description: "Virgin Media cable broadband — fastest in many UK areas.",
      shortDesc: "Cable broadband with speeds up to 1Gbps in many areas",
      featured: true, verified: true, updatedAt: "2026-05-01T00:00:00Z",
    },
    title: "Virgin Media M500 Fibre Broadband",
    slug: "virgin-media-m500",
    vertical: "broadband",
    market: "uk",
    price: 32.00,
    currency: "GBP",
    contractLength: 18,
    setupFee: 35,
    setupFeeWaived: false,
    specs: {
      downloadSpeed: 516, uploadSpeed: 36,
      technology: "Cable", unlimited: true,
      router: true, routerModel: "Hub 5",
      staticIp: false, ipv6: true, ukSupport: true,
    },
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=1438&awinaffid=YOURPUBID&p=https%3A%2F%2Fwww.virginmedia.com",
    affiliateNetwork: "awin",
    commissionType: "cpa", commissionValue: 45,
    badge: "Fastest Cable", badgeColor: "#9B8FFF",
    highlight: "Consistently fastest cable speeds in available areas",
    isActive: true, isFeatured: true, isExclusive: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the fastest broadband available in the UK?",
    answer: "The fastest widely available broadband in the UK is BT Full Fibre 900, offering download speeds of up to 900Mbps via full-fibre FTTP technology. In some areas, Virgin Media and Hyperoptic offer gigabit speeds (1,000Mbps+). For most homes, speeds of 100–500Mbps are more than sufficient.",
  },
  {
    question: "What is the cheapest unlimited broadband deal in the UK?",
    answer: "As of 2026, the cheapest unlimited broadband deals start from around £22–28 per month. Sky Fibre offers strong value at £28/mo, while budget providers like NOW Broadband and Vodafone offer deals below £25/mo. Always check for setup fees and contract length before signing up.",
  },
  {
    question: "What is the difference between FTTP and FTTC broadband?",
    answer: "FTTP (Fibre to the Premises) delivers fibre optic cables directly to your home, providing the fastest and most reliable speeds — typically 100Mbps to 1Gbps. FTTC (Fibre to the Cabinet) delivers fibre to a street cabinet, then uses copper wiring to your home, limiting speeds to around 35–80Mbps. FTTP is superior but not yet available everywhere.",
  },
  {
    question: "How long does it take to switch broadband providers in the UK?",
    answer: "Thanks to Ofcom's One Touch Switching (OTS) regulations introduced in 2023, switching most broadband providers takes just 1 working day. Your new provider handles the switch, and you shouldn't experience any service interruption. Virgin Media switches may take slightly longer as they use a separate network.",
  },
  {
    question: "Can I get broadband without a phone line in the UK?",
    answer: "Yes. Full Fibre (FTTP) broadband providers like BT, Sky, and Vodafone no longer require a phone line. Virgin Media cable broadband also doesn't use a phone line. These are the best options if you want broadband-only deals without paying for a landline you don't use.",
  },
];

// ── Schema ─────────────────────────────────────────────────────────
const schemas = buildPageSchemas([
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Broadband Deals", url: "/broadband" },
  ]),
  comparisonListSchema(BROADBAND_DEALS, "Best UK Broadband Deals 2026", "/broadband"),
  faqSchema(FAQ_ITEMS),
]);

// ── Page Component ─────────────────────────────────────────────────
export default function BroadbandPage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main>
        {/* ── Hero ── */}
        <section className="relative bg-brand-navy pt-24 pb-16 px-4">
          <div className="max-w-container mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-brand-slate">
                <li><a href="/" className="hover:text-brand-cream transition-colors">Home</a></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-brand-cream">Broadband</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <span className="section-label text-brand-teal text-xs font-semibold tracking-widest uppercase">
                📡 UK Broadband Comparison
              </span>
              <h1 className="font-display font-bold text-display-lg text-brand-cream mt-3 mb-5">
                Best Broadband Deals UK {new Date().getFullYear()}
              </h1>
              <p className="text-brand-slate text-lg leading-relaxed mb-8 max-w-2xl">
                We compare every major UK broadband provider — BT, Sky, Virgin Media, TalkTalk, Vodafone and more.
                Find the fastest speeds, lowest prices and best value contracts available in your area.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Providers compared", value: "24+" },
                  { label: "Deals tracked", value: "180+" },
                  { label: "Updated", value: "Daily" },
                  { label: "Avg saving", value: "£156/yr" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="font-display font-bold text-brand-teal text-xl">{stat.value}</span>
                    <span className="text-brand-slate text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Affiliate Disclosure ── */}
        <div className="bg-brand-navy-2 border-y border-white/5 py-3 px-4">
          <div className="max-w-container mx-auto">
            <p className="text-brand-slate text-xs">
              <span className="text-brand-amber font-semibold">Disclosure:</span>{" "}
              We may earn a commission when you click links on this page. This doesn't affect our editorial independence —
              all deals are ranked by value, not by commission.{" "}
              <a href="/about/affiliate-disclosure" className="underline hover:text-brand-cream transition-colors">
                Learn more
              </a>
            </p>
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <section className="bg-brand-navy py-16 px-4" aria-label="Broadband comparison table">
          <div className="max-w-container mx-auto">
            <h2 className="font-display font-bold text-2xl text-brand-cream mb-8">
              Compare broadband deals
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" role="table" aria-label="Broadband provider comparison">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Provider</th>
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Speed</th>
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Technology</th>
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Contract</th>
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Price/mo</th>
                    <th className="text-left py-4 px-4 text-brand-slate text-sm font-medium">Rating</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {BROADBAND_DEALS.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-brand-cream">
                            {deal.provider.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-display font-semibold text-brand-cream text-sm">
                              {deal.provider.name}
                            </div>
                            {deal.badge && (
                              <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${deal.badgeColor}22`,
                                  color: deal.badgeColor,
                                  border: `1px solid ${deal.badgeColor}44`,
                                }}
                              >
                                {deal.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className="font-display font-bold text-brand-cream">
                          {(deal.specs.downloadSpeed as number)}Mbps
                        </span>
                        <span className="text-brand-slate text-xs ml-1">avg.</span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-brand-slate text-sm">{deal.specs.technology as string}</span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="text-brand-slate text-sm">{deal.contractLength} months</span>
                      </td>
                      <td className="py-5 px-4">
                        <div>
                          <span className="font-display font-bold text-brand-cream text-lg">
                            £{deal.price.toFixed(2)}
                          </span>
                          {deal.originalPrice && (
                            <span className="text-brand-slate text-xs line-through ml-2">
                              £{deal.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {deal.setupFeeWaived && (
                          <span className="text-brand-teal text-xs">Free setup</span>
                        )}
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-brand-amber text-sm">★</span>
                          <span className="text-brand-cream text-sm font-medium">{deal.provider.rating}</span>
                          <span className="text-brand-slate text-xs">({deal.provider.reviewCount.toLocaleString()})</span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <a
                          href={`/go/${deal.providerId}?deal=${deal.id}`}
                          rel="nofollow sponsored"
                          className="inline-flex items-center gap-1 bg-brand-teal text-brand-navy text-sm font-bold px-4 py-2 rounded-lg hover:bg-brand-teal-dark transition-colors"
                          aria-label={`Get ${deal.provider.name} deal — ${deal.title}`}
                        >
                          Get Deal →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Editorial Guide (SEO content) ── */}
        <section className="bg-brand-navy-2 py-16 px-4">
          <div className="max-w-container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main content */}
              <div className="lg:col-span-2 prose prose-invert prose-lg max-w-none">
                <h2 id="best-broadband-uk-2026">Best broadband deals UK 2026</h2>
                <p>
                  The UK broadband market has never been more competitive. With full-fibre (FTTP) coverage
                  now reaching over 60% of UK premises and prices falling, there&apos;s never been a better time
                  to switch or upgrade your broadband.
                </p>

                <h3 id="best-overall">Best overall: BT Full Fibre 900</h3>
                <p>
                  BT&apos;s Full Fibre 900 plan offers 900Mbps download speeds over a genuine FTTP connection,
                  making it the fastest widely available residential broadband in the UK. At £34.99/month on
                  a 24-month contract, it&apos;s not the cheapest option, but it includes BT&apos;s Smart Hub 2 router
                  and free setup.
                </p>

                <h3 id="best-value">Best value: Sky Fibre Max</h3>
                <p>
                  Sky Fibre Max at £28/month is the standout value option for most households. 500Mbps is
                  more than fast enough for 4K streaming, video calls and gaming, and Sky&apos;s customer
                  service consistently outperforms the industry average.
                </p>
              </div>

              {/* Sidebar: Quick picks */}
              <aside aria-label="Quick picks">
                <div className="sticky top-24 space-y-4">
                  <h3 className="font-display font-bold text-brand-cream text-lg">Quick picks</h3>
                  {[
                    { label: "Best overall", value: "BT Full Fibre 900", href: "/reviews/bt" },
                    { label: "Best value", value: "Sky Fibre Max", href: "/reviews/sky" },
                    { label: "Fastest cable", value: "Virgin Media M500", href: "/reviews/virgin-media" },
                    { label: "Best budget", value: "NOW Broadband", href: "/reviews/now" },
                    { label: "Best for gamers", value: "Hyperoptic 1Gbps", href: "/reviews/hyperoptic" },
                  ].map(pick => (
                    <a
                      key={pick.label}
                      href={pick.href}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8 hover:border-brand-teal/30 transition-all group"
                    >
                      <div>
                        <div className="text-brand-slate text-xs">{pick.label}</div>
                        <div className="text-brand-cream text-sm font-medium group-hover:text-brand-teal transition-colors">{pick.value}</div>
                      </div>
                      <span className="text-brand-teal text-sm">→</span>
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── FAQ Section (AEO/Featured Snippets) ── */}
        <section className="bg-brand-navy py-16 px-4" aria-labelledby="faq-heading">
          <div className="max-w-container mx-auto max-w-3xl">
            <h2 id="faq-heading" className="font-display font-bold text-2xl text-brand-cream mb-8">
              Frequently asked questions
            </h2>

            {/* Speakable section for voice/AI search */}
            <div
              className="space-y-4"
              data-speakable="true"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white/3 border border-white/8 rounded-xl overflow-hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <summary
                    className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-white/2 transition-colors"
                    itemProp="name"
                  >
                    <span className="font-medium text-brand-cream pr-4">{item.question}</span>
                    <span className="text-brand-teal text-xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <div
                    className="px-6 pb-5 text-brand-slate leading-relaxed"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sticky CTA ── */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-xl border-t border-brand-teal/20 py-4 px-4"
          role="complementary"
          aria-label="Deal CTA"
        >
          <div className="max-w-container mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-brand-cream font-semibold text-sm">Compare broadband deals now</span>
              <span className="text-brand-slate text-xs ml-2 hidden sm:inline">180+ deals, updated daily</span>
            </div>
            <a
              href="/compare/broadband"
              className="bg-brand-teal text-brand-navy font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-teal-dark transition-colors"
            >
              Find My Best Deal →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
