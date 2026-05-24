export const runtime = "edge";
export const revalidate = 3600;

import { Suspense } from "react";
import { homepageMetadata } from "@/lib/seo.metadata";
import { buildPageSchemas, faqSchema, comparisonListSchema } from "@/lib/schema.helpers";

export const metadata = homepageMetadata();

// ── Static featured deals (replace with Supabase fetch in prod) ──
const FEATURED_DEALS = [
  { id:"1", slug:"bt-ff900", providerId:"bt", provider:{ name:"BT", slug:"bt", rating:4.2, reviewCount:3847, logo:"", website:"", vertical:"broadband" as const, market:["uk" as const], trustScore:82, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"BT Full Fibre 900", vertical:"broadband" as const, market:"uk" as const, price:34.99, currency:"GBP" as const, contractLength:24, setupFeeWaived:true, specs:{ downloadSpeed:900, technology:"FTTP" }, affiliateUrl:"/go/bt", affiliateNetwork:"awin" as const, commissionType:"cpa" as const, badge:"Most Popular", badgeColor:"#00D4AA", highlight:"900Mbps full fibre", isActive:true, isFeatured:true, isExclusive:false, createdAt:"", updatedAt:"" },
  { id:"2", slug:"sky-fibre-max", providerId:"sky", provider:{ name:"Sky", slug:"sky", rating:4.0, reviewCount:5120, logo:"", website:"", vertical:"broadband" as const, market:["uk" as const], trustScore:78, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"Sky Fibre Max", vertical:"broadband" as const, market:"uk" as const, price:28.00, currency:"GBP" as const, contractLength:18, setupFeeWaived:true, specs:{ downloadSpeed:500, technology:"FTTC" }, affiliateUrl:"/go/sky", affiliateNetwork:"awin" as const, commissionType:"cpa" as const, badge:"Best Value", badgeColor:"#FFB547", highlight:"Cheapest unlimited fibre", isActive:true, isFeatured:true, isExclusive:false, createdAt:"", updatedAt:"" },
  { id:"3", slug:"siteground-pro", providerId:"siteground", provider:{ name:"SiteGround", slug:"siteground", rating:4.7, reviewCount:2341, logo:"", website:"", vertical:"hosting" as const, market:["uk" as const], trustScore:91, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"SiteGround Pro", vertical:"hosting" as const, market:"uk" as const, price:7.99, currency:"GBP" as const, contractLength:12, setupFeeWaived:true, specs:{ storage:20, storageType:"NVMe", uptime:99.9 }, affiliateUrl:"/go/siteground", affiliateNetwork:"awin" as const, commissionType:"cpa" as const, badge:"Top Rated", badgeColor:"#9B8FFF", highlight:"NVMe SSD · Free SSL", isActive:true, isFeatured:true, isExclusive:false, createdAt:"", updatedAt:"" },
  { id:"4", slug:"nordvpn", providerId:"nordvpn", provider:{ name:"NordVPN", slug:"nordvpn", rating:4.6, reviewCount:8901, logo:"", website:"", vertical:"vpn" as const, market:["uk" as const], trustScore:89, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"NordVPN 2-Year Plan", vertical:"vpn" as const, market:"uk" as const, price:3.49, currency:"GBP" as const, contractLength:24, setupFeeWaived:true, specs:{}, affiliateUrl:"/go/nordvpn", affiliateNetwork:"impact" as const, commissionType:"cpa" as const, badge:"Editor's Pick", badgeColor:"#00D4AA", highlight:"68% off + 3 months free", isActive:true, isFeatured:true, isExclusive:true, createdAt:"", updatedAt:"" },
  { id:"5", slug:"voxi-unlimited", providerId:"voxi", provider:{ name:"Voxi", slug:"voxi", rating:4.4, reviewCount:1203, logo:"", website:"", vertical:"mobile" as const, market:["uk" as const], trustScore:81, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"Voxi Unlimited", vertical:"mobile" as const, market:"uk" as const, price:12.00, currency:"GBP" as const, contractLength:1, setupFeeWaived:true, specs:{ data:"unlimited", fiveG:true }, affiliateUrl:"/go/voxi", affiliateNetwork:"awin" as const, commissionType:"cpa" as const, badge:"Unlimited Best", badgeColor:"#FFB547", highlight:"Truly unlimited 5G data", isActive:true, isFeatured:true, isExclusive:false, createdAt:"", updatedAt:"" },
  { id:"6", slug:"hostinger-premium", providerId:"hostinger", provider:{ name:"Hostinger", slug:"hostinger", rating:4.3, reviewCount:4521, logo:"", website:"", vertical:"hosting" as const, market:["uk" as const], trustScore:80, description:"", shortDesc:"", featured:true, verified:true, updatedAt:"" }, title:"Hostinger Premium", vertical:"hosting" as const, market:"uk" as const, price:2.99, currency:"GBP" as const, contractLength:12, setupFeeWaived:true, specs:{ storage:100, storageType:"SSD", uptime:99.9 }, affiliateUrl:"/go/hostinger", affiliateNetwork:"impact" as const, commissionType:"cpa" as const, badge:"Budget King", badgeColor:"#9B8FFF", highlight:"100GB SSD · Free domain", isActive:true, isFeatured:true, isExclusive:false, createdAt:"", updatedAt:"" },
];

const FAQ_ITEMS = [
  { question:"How does NextOffer make money?", answer:"NextOffer earns affiliate commissions when you click our links and sign up for a service. This never affects the price you pay — providers pay us, not you. Our editorial rankings are based on value and quality, not commission rates." },
  { question:"Are the deals on NextOffer up to date?", answer:"Yes. We update our deals database daily and manually verify pricing weekly. Every deal shows its last-updated date. If you spot an outdated price, use our contact form to let us know." },
  { question:"Which broadband provider is best in the UK?", answer:"It depends on your location and needs. BT Full Fibre 900 is best for speed, Sky Fibre Max for value, and Virgin Media for cable coverage. Enter your postcode in our broadband comparison tool to see every provider available at your address." },
  { question:"Is NextOffer free to use?", answer:"Yes, completely free. We are funded by affiliate commissions from providers. You pay the same price whether you go directly to a provider or through our links." },
];

const SCHEMAS = buildPageSchemas([
  comparisonListSchema(FEATURED_DEALS as Parameters<typeof comparisonListSchema>[0], "Best UK Deals Today", "/"),
  faqSchema(FAQ_ITEMS),
]);

const VERTICALS = [
  { icon:"📡", label:"Broadband",      href:"/broadband", desc:"Compare fibre & cable",       color:"#00D4AA", count:"24 providers" },
  { icon:"🖥️", label:"Web Hosting",    href:"/hosting",   desc:"SSD, managed & cloud",        color:"#9B8FFF", count:"18 providers" },
  { icon:"📱", label:"Mobile SIM",     href:"/mobile",    desc:"SIM-only & contracts",         color:"#FFB547", count:"16 providers" },
  { icon:"☁️", label:"VPS & Cloud",    href:"/vps",       desc:"Dedicated & cloud servers",    color:"#00D4AA", count:"12 providers" },
  { icon:"🔐", label:"VPN",            href:"/vpn",       desc:"Privacy & security",           color:"#9B8FFF", count:"10 providers" },
  { icon:"💼", label:"Business Net",   href:"/business",  desc:"Leased lines & FTTP",          color:"#FFB547", count:"8 providers"  },
  { icon:"📞", label:"VoIP",           href:"/voip",      desc:"Cloud phone systems",          color:"#00D4AA", count:"9 providers"  },
  { icon:"🌐", label:"Domains",        href:"/domains",   desc:".co.uk & .com registration",   color:"#9B8FFF", count:"6 providers"  },
  { icon:"🏗️", label:"Website Builders",href:"/builders", desc:"No-code site creators",        color:"#FFB547", count:"7 providers"  },
  { icon:"🤖", label:"AI Tools",       href:"/ai",        desc:"SaaS & AI platforms",          color:"#00D4AA", count:"15 providers" },
];

const STATS = [
  { value:"847+",  label:"Deals tracked"      },
  { value:"12K+",  label:"UK users helped"    },
  { value:"Daily", label:"Price updates"      },
  { value:"£247",  label:"Avg annual saving"  },
];

const VERTICAL_COLORS: Record<string, string> = {
  broadband:"#00D4AA", hosting:"#9B8FFF", mobile:"#FFB547",
  vpn:"#00D4AA", vps:"#FF6B6B", business:"#4ECDC4",
};

export default function HomePage() {
  return (
    <>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <main>
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-navy">
          {/* Gradient blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle, rgba(155,143,255,0.07) 0%, transparent 70%)" }} />

          <div className="container section-pad relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-teal/30 bg-brand-teal/5 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse-glow" />
                <span className="text-brand-teal text-xs font-semibold tracking-widest uppercase">
                  🇬🇧 UK&apos;s Smartest Comparison Engine
                </span>
              </div>

              {/* H1 */}
              <h1 className="font-display font-bold text-display-xl text-brand-cream mb-6 leading-none">
                Stop overpaying for{" "}
                <span className="text-gradient">UK services</span>
              </h1>

              <p className="text-brand-slate text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                We compare 800+ deals across broadband, hosting, mobile, VPN and more.
                Updated daily. Always unbiased. Always free.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-14">
                <a href="/compare" className="btn-primary text-base px-8 py-4">
                  Compare All Deals →
                </a>
                <a href="/deals" className="btn-secondary text-base px-8 py-4">
                  Today&apos;s Top Deals
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-white/5">
                {["Awin Verified Partner","No Hidden Ads","Updated Daily","GDPR Compliant","100% Free"].map(t => (
                  <span key={t} className="flex items-center gap-2 text-brand-slate text-sm">
                    <span className="text-brand-teal">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-brand-navy-2 border-y border-white/5 py-10 px-4">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-display font-bold text-3xl text-brand-teal mb-1">{s.value}</div>
                  <div className="text-brand-slate text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VERTICALS GRID ── */}
        <section className="bg-brand-navy py-20 px-4">
          <div className="container">
            <div className="text-center mb-12">
              <span className="section-label">Everything Covered</span>
              <h2 className="font-display font-bold text-display-md text-brand-cream mt-3 mb-4">
                10 categories, 800+ deals
              </h2>
              <p className="text-brand-slate text-lg max-w-xl mx-auto">
                From home broadband to enterprise cloud — we compare everything UK businesses and households need.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {VERTICALS.map(v => (
                <a key={v.label} href={v.href}
                  className="group card rounded-2xl p-5 flex flex-col gap-3 no-underline">
                  <span className="text-3xl">{v.icon}</span>
                  <div>
                    <div className="font-display font-semibold text-brand-cream text-sm mb-1 group-hover:text-brand-teal transition-colors">
                      {v.label}
                    </div>
                    <div className="text-brand-slate text-xs leading-relaxed">{v.desc}</div>
                  </div>
                  <span className="text-xs mt-auto" style={{ color: v.color }}>
                    {v.count} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED DEALS ── */}
        <section className="bg-brand-navy-2 py-20 px-4">
          <div className="container">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <span className="section-label">Live Deals</span>
                <h2 className="font-display font-bold text-display-md text-brand-cream mt-3">
                  Today&apos;s top picks
                </h2>
              </div>
              <a href="/deals" className="btn-ghost text-sm">
                View all 847 deals →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED_DEALS.map((deal, i) => {
                const accentColor = deal.badgeColor || VERTICAL_COLORS[deal.vertical] || "#00D4AA";
                return (
                  <div key={deal.id} className="card rounded-2xl p-6 flex flex-col gap-4 group relative overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                      style={{ background:`radial-gradient(circle, ${accentColor}18 0%, transparent 70%)` }} />

                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm"
                          style={{ background:`${accentColor}20`, color: accentColor }}>
                          {deal.provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-display font-semibold text-brand-cream text-sm">{deal.provider.name}</div>
                          <div className="text-brand-slate text-xs capitalize">{deal.vertical}</div>
                        </div>
                      </div>
                      {deal.badge && (
                        <span className="badge text-xs" style={{
                          background:`${accentColor}18`, color: accentColor,
                          border:`1px solid ${accentColor}40`
                        }}>{deal.badge}</span>
                      )}
                    </div>

                    {/* Title + highlight */}
                    <div>
                      <div className="font-display font-semibold text-brand-cream mb-1">{deal.title}</div>
                      {deal.highlight && <div className="text-brand-slate text-sm">{deal.highlight}</div>}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <div>
                        <span className="font-display font-bold text-2xl text-brand-cream">
                          £{deal.price.toFixed(2)}
                        </span>
                        <span className="text-brand-slate text-xs ml-1">/mo</span>
                        {deal.setupFeeWaived && (
                          <div className="text-xs mt-0.5" style={{ color: accentColor }}>Free setup</div>
                        )}
                      </div>
                      <a href={`/go/${deal.providerId}?deal=${deal.id}`}
                        rel="nofollow sponsored"
                        className="text-sm font-bold px-4 py-2 rounded-lg transition-all"
                        style={{
                          background: `${accentColor}20`, color: accentColor,
                          border:`1px solid ${accentColor}40`
                        }}
                        aria-label={`Get deal: ${deal.title}`}>
                        Get Deal →
                      </a>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-brand-amber text-xs">★★★★★</span>
                      <span className="text-brand-slate text-xs">
                        {deal.provider.rating} ({deal.provider.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── AI MATCHER ── */}
        <section className="py-20 px-4">
          <div className="container">
            <div className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
              style={{ background:"linear-gradient(135deg, rgba(0,212,170,0.07) 0%, rgba(155,143,255,0.07) 100%)", border:"1px solid rgba(0,212,170,0.18)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background:"radial-gradient(circle, rgba(155,143,255,0.1) 0%, transparent 70%)" }} />

              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <span className="section-label">🤖 AI-Powered</span>
                  <h2 className="font-display font-bold text-display-md text-brand-cream mt-3 mb-5">
                    Get personalised recommendations
                  </h2>
                  <p className="text-brand-slate text-lg leading-relaxed mb-8">
                    Tell us your usage, budget and postcode. Our AI matches you to the best deals available in your area.
                  </p>
                  <a href="/ai-picks" className="btn-primary">Try AI Matcher →</a>
                </div>

                <div className="space-y-3">
                  {[
                    { q:"Best broadband under £30/mo in Manchester?", a:"Sky Fibre Max at £28/mo — 500Mbps, no setup fee." },
                    { q:"Cheapest 5G SIM for heavy data users?",      a:"Voxi Unlimited at £12/mo — truly unlimited 5G." },
                    { q:"Fastest managed WordPress hosting UK?",       a:"Kinsta Business — 99.9% uptime, £24/mo." },
                  ].map((item, i) => (
                    <div key={i} className="glass rounded-xl p-4">
                      <p className="text-xs mb-2"><span className="text-brand-purple">You: </span><span className="text-brand-slate">{item.q}</span></p>
                      <p className="text-xs"><span className="text-brand-teal">AI: </span><span className="text-brand-cream">{item.a}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ (AEO) ── */}
        <section className="bg-brand-navy-2 py-20 px-4" aria-labelledby="faq-heading">
          <div className="container max-w-3xl">
            <h2 id="faq-heading" className="font-display font-bold text-display-sm text-brand-cream mb-10 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group glass rounded-xl overflow-hidden"
                  itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-white/2 transition-colors" itemProp="name">
                    <span className="font-medium text-brand-cream text-sm pr-6">{item.question}</span>
                    <span className="text-brand-teal text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-brand-slate text-sm leading-relaxed"
                    itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── STICKY CTA ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-xl border-t border-brand-teal/20 py-4 px-4 no-print">
          <div className="container flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-brand-cream font-semibold text-sm">🔥 Compare 800+ UK deals — free</span>
              <span className="text-brand-slate text-xs ml-3 hidden sm:inline">Updated daily · No signup needed</span>
            </div>
            <a href="/compare" className="btn-primary text-sm py-2.5 px-6">Compare Now →</a>
          </div>
        </div>
      </main>
    </>
  );
}
