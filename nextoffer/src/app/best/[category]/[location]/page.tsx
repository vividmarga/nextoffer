// ─────────────────────────────────────────────────────────────────
// nextoffer/src/app/best/[category]/[location]/page.tsx
// Programmatic SEO — generates pages for every vertical × location
// e.g. /best/broadband/manchester → "Best Broadband in Manchester"
// Generates 1000s of pages via generateStaticParams
// ─────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bestInLocationMetadata } from "@/lib/seo.metadata";
import {
  faqSchema, breadcrumbSchema, buildPageSchemas, comparisonListSchema
} from "@/lib/schema.helpers";
import type { Vertical } from "@/types";

export const revalidate = 86400; // ISR: regenerate daily

// ── Valid verticals and locations ────────────────────────────────
const VALID_VERTICALS: Vertical[] = [
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

// ── generateStaticParams → 30 cities × 10 verticals = 300 pages ──
export async function generateStaticParams() {
  const params: { category: string; location: string }[] = [];
  for (const category of VALID_VERTICALS) {
    for (const location of UK_CITIES) {
      params.push({ category, location });
    }
  }
  return params;
}

// ── Metadata ──────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; location: string }>;
}): Promise<Metadata> {
  const { category, location } = await params;
  const vertical = category as Vertical;
  const city = formatCityName(location);
  return bestInLocationMetadata(vertical, city);
}

// ── Helpers ───────────────────────────────────────────────────────
function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function verticalLabel(v: Vertical): string {
  const labels: Record<string, string> = {
    broadband: "Broadband", hosting: "Web Hosting", mobile: "Mobile SIM",
    vps: "VPS Hosting", vpn: "VPN", business: "Business Internet",
    voip: "VoIP", domains: "Domain Names", builders: "Website Builders", ai: "AI Tools",
  };
  return labels[v] || v;
}

// ── Mock deal fetcher (replace with Supabase in production) ───────
async function getDealsForLocation(vertical: Vertical, location: string) {
  // In production: query Supabase with location availability
  // SELECT d.* FROM deals d
  // JOIN provider_locations pl ON pl.provider_id = d.provider_id
  // JOIN uk_locations l ON l.id = pl.location_id
  // WHERE l.slug = $1 AND d.vertical = $2 AND d.is_active = true
  // ORDER BY d.is_featured DESC, d.price ASC LIMIT 10
  return []; // Return empty array for build — populated at runtime
}

// ── Page Component ─────────────────────────────────────────────────
export default async function BestInLocationPage({
  params,
}: {
  params: Promise<{ category: string; location: string }>;
}) {
  const { category, location } = await params;
  const vertical = category as Vertical;
  const city     = formatCityName(location);
  const year     = new Date().getFullYear();

  if (!VALID_VERTICALS.includes(vertical) || !UK_CITIES.includes(location)) {
    notFound();
  }

  const deals = await getDealsForLocation(vertical, location);
  const vLabel = verticalLabel(vertical);

  const faqs = [
    {
      question: `What is the best ${vLabel.toLowerCase()} deal in ${city}?`,
      answer: `The best ${vLabel.toLowerCase()} deals in ${city} depend on your needs and budget. We compare all available providers in your area to find the fastest, most reliable and best value options. Use our comparison tool above to filter by speed, price and contract length.`,
    },
    {
      question: `How do I check which broadband providers cover ${city}?`,
      answer: `Enter your postcode in our coverage checker to see every broadband provider available at your address in ${city}. Different streets can have different provider availability depending on the underlying network infrastructure.`,
    },
    {
      question: `Is full fibre broadband available in ${city}?`,
      answer: `Full fibre (FTTP) broadband availability in ${city} is expanding rapidly. Most city centre postcodes now have access to full fibre from at least one provider. Openreach's network now covers over 60% of UK premises. Check your postcode for exact availability.`,
    },
  ];

  const schemas = buildPageSchemas([
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: vLabel, url: `/${vertical}` },
      { name: `Best in ${city}`, url: `/best/${vertical}/${location}` },
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".speakable-intro", ".speakable-verdict"],
      },
    },
  ]);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main>
        {/* ── Hero ── */}
        <section className="bg-brand-navy pt-24 pb-16 px-4">
          <div className="max-w-container mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-brand-slate">
                <li><a href="/" className="hover:text-brand-cream">Home</a></li>
                <li>›</li>
                <li><a href={`/${vertical}`} className="hover:text-brand-cream">{vLabel}</a></li>
                <li>›</li>
                <li className="text-brand-cream" aria-current="page">Best in {city}</li>
              </ol>
            </nav>

            {/* Speakable intro — optimised for voice search & AI answers */}
            <div className="speakable-intro max-w-3xl">
              <h1 className="font-display font-bold text-display-lg text-brand-cream mb-5">
                Best {vLabel} Deals in {city} {year}
              </h1>
              <p className="text-brand-slate text-lg leading-relaxed">
                We compare every {vLabel.toLowerCase()} provider available in {city} — checking prices,
                speeds, reliability and customer reviews — to help you find the best deal for your
                needs and budget in {year}.
              </p>
            </div>

            {/* Location stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { label: "Providers in area", value: "12+" },
                { label: "Updated", value: "Today" },
                { label: "Avg saving vs renewal", value: "£180/yr" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-display font-bold text-brand-teal text-xl">{s.value}</span>
                  <span className="text-brand-slate text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Postcode checker ── */}
        <section className="bg-brand-navy-2 py-12 px-4">
          <div className="max-w-container mx-auto max-w-2xl text-center">
            <h2 className="font-display font-bold text-xl text-brand-cream mb-4">
              Check exact availability in {city}
            </h2>
            <p className="text-brand-slate text-sm mb-6">
              Coverage varies by street — enter your postcode to see every deal available at your address.
            </p>
            <form
              action="/check-availability"
              method="GET"
              className="flex gap-3 max-w-md mx-auto"
              aria-label="Postcode availability checker"
            >
              <input
                type="text"
                name="postcode"
                placeholder="Enter your postcode, e.g. M1 1AB"
                className="flex-1 bg-white/5 border border-white/12 text-brand-cream rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal/40 placeholder:text-brand-slate-2"
                aria-label="Your postcode"
                autoComplete="postal-code"
              />
              <button
                type="submit"
                className="bg-brand-teal text-brand-navy font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand-teal-dark transition-colors"
              >
                Check →
              </button>
            </form>
          </div>
        </section>

        {/* ── Deals grid ── */}
        <section className="bg-brand-navy py-16 px-4">
          <div className="max-w-container mx-auto">
            <h2 className="font-display font-bold text-2xl text-brand-cream mb-8">
              Top {vLabel} deals in {city}
            </h2>

            {deals.length === 0 ? (
              /* Empty state — drives to category page */
              <div className="text-center py-16">
                <p className="text-brand-slate text-lg mb-6">
                  Loading live {vLabel.toLowerCase()} deals for {city}...
                </p>
                <a
                  href={`/${vertical}`}
                  className="bg-brand-teal text-brand-navy font-bold px-8 py-4 rounded-xl hover:bg-brand-teal-dark transition-colors inline-block"
                >
                  See All {vLabel} Deals →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal: { id: string; title: string }) => (
                  <div key={deal.id} className="glass rounded-2xl p-6">
                    <h3 className="font-display font-semibold text-brand-cream">{deal.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Speakable verdict ── */}
        <section className="bg-brand-navy-2 py-12 px-4">
          <div className="max-w-container mx-auto max-w-3xl">
            <div className="speakable-verdict glass rounded-2xl p-8">
              <h2 className="font-display font-bold text-xl text-brand-cream mb-4">
                Our verdict: Best {vLabel} in {city}
              </h2>
              <p className="text-brand-slate leading-relaxed">
                {city} has excellent {vLabel.toLowerCase()} coverage with strong competition between major providers.
                For most residents, we recommend checking for full-fibre availability first — FTTP connections
                offer the best long-term value and reliability. Compare prices above and always check if your
                current provider will match a competitor&apos;s offer before switching.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-brand-navy py-16 px-4">
          <div className="max-w-container mx-auto max-w-3xl">
            <h2 className="font-display font-bold text-2xl text-brand-cream mb-8">
              {vLabel} in {city} — common questions
            </h2>
            <div
              className="space-y-3"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {faqs.map((item, i) => (
                <details
                  key={i}
                  className="glass rounded-xl overflow-hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none" itemProp="name">
                    <span className="font-medium text-brand-cream text-sm pr-4">{item.question}</span>
                    <span className="text-brand-teal">+</span>
                  </summary>
                  <div
                    className="px-6 pb-5 text-brand-slate text-sm leading-relaxed"
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

        {/* ── Internal links — SEO silo ── */}
        <section className="bg-brand-navy-2 py-12 px-4">
          <div className="max-w-container mx-auto">
            <h3 className="font-display font-bold text-lg text-brand-cream mb-6">
              {vLabel} deals in nearby areas
            </h3>
            <div className="flex flex-wrap gap-3">
              {UK_CITIES
                .filter(c => c !== location)
                .slice(0, 12)
                .map(c => (
                  <a
                    key={c}
                    href={`/best/${vertical}/${c}`}
                    className="text-brand-slate text-sm px-4 py-2 rounded-lg border border-white/8 hover:border-brand-teal/30 hover:text-brand-teal transition-all"
                  >
                    {formatCityName(c)}
                  </a>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
