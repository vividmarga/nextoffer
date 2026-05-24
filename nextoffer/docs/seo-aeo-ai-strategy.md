# NextOffer UK — SEO, AEO & AI Search Strategy
**Version 1.0 | May 2026**

---

## 1. Architecture Overview

### URL Structure
```
nextoffer.co.uk/                          ← Homepage (DR target: 40+)
nextoffer.co.uk/broadband/                ← Category hub
nextoffer.co.uk/broadband/[provider]/     ← Provider page
nextoffer.co.uk/best/broadband/london/    ← Programmatic SEO
nextoffer.co.uk/compare/bt-vs-sky/        ← Comparison page
nextoffer.co.uk/deals/broadband/          ← Deals index
nextoffer.co.uk/blog/[slug]/              ← Blog post
nextoffer.co.uk/guides/[slug]/            ← Long-form guide
nextoffer.co.uk/reviews/[provider]/       ← Provider review
nextoffer.co.uk/ro/[category]/            ← Romanian market
```

### Topic Silos (Internal Linking Architecture)
```
Broadband Silo
├── /broadband (hub)
├── /broadband/fibre
├── /broadband/cable
├── /broadband/business
├── /reviews/bt /reviews/sky /reviews/virgin-media ...
├── /compare/bt-vs-sky /compare/sky-vs-virgin ...
├── /best/broadband/london /best/broadband/manchester ...
├── /guides/how-to-switch-broadband-uk
├── /guides/fttp-vs-fttc-explained
└── /blog/category/broadband (all blog posts)
```

---

## 2. Keyword Strategy

### Tier 1 — High-Volume Category Keywords (SEO pillar pages)
| Keyword | Monthly Volume | Difficulty | Priority |
|---------|---------------|------------|----------|
| best broadband deals uk | 27,000 | 72 | 🔴 High |
| best web hosting uk | 12,000 | 65 | 🔴 High |
| best sim only deals uk | 18,000 | 60 | 🔴 High |
| compare broadband uk | 9,000 | 68 | 🔴 High |
| cheapest broadband uk | 14,000 | 70 | 🔴 High |
| best vps hosting uk | 3,600 | 55 | 🟡 Medium |
| best vpn uk | 22,000 | 75 | 🟡 Medium |

### Tier 2 — Comparison Keywords (high commercial intent)
| Keyword | Volume | CPC | Priority |
|---------|--------|-----|----------|
| bt vs sky broadband | 3,200 | £1.80 | 🔴 High |
| sky vs virgin broadband | 2,400 | £2.10 | 🔴 High |
| siteground vs bluehost | 5,400 | £3.20 | 🔴 High |
| nordvpn vs expressvpn | 8,100 | £2.60 | 🔴 High |
| kinsta vs wpengine | 2,900 | £4.50 | 🟡 Medium |

### Tier 3 — Programmatic SEO (Location × Vertical)
Template: `best [vertical] in [city]`
- 30 cities × 10 verticals = **300 pages**
- Target: 200–1,000 monthly searches each
- Combined target: **60,000–300,000 monthly visits**

### Tier 4 — Long-tail / AEO Keywords
Questions optimised for featured snippets and AI answers:
- "what is the fastest broadband in the uk"
- "how much does broadband cost in the uk per month"
- "is sky or bt broadband better"
- "which is the cheapest web hosting uk"
- "how do i switch broadband without losing service"
- "what is fttp broadband uk"

---

## 3. Schema.org Implementation (Advanced)

### Page-Level Schema Map
| Page Type | Schema Types Used |
|-----------|------------------|
| Homepage | Organization, WebSite, SearchAction |
| Category | ItemList, FAQPage, BreadcrumbList |
| Deal/Offer | Product, Offer, AggregateRating |
| Review | Review, AggregateRating, Person |
| Blog Post | Article, BreadcrumbList, Person |
| Comparison | FAQPage, ItemList, BreadcrumbList |
| Location | LocalBusiness, BreadcrumbList |
| Guide | HowTo, FAQPage, Article |
| Site-wide | Speakable (voice/AI) |

### Critical Schema Fields for AI Visibility
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is the cheapest broadband in the UK?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "As of 2026, the cheapest unlimited broadband deals start from £22/month..."
    }
  }]
}
```

### Speakable Schema (Voice + AI Search)
```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".speakable-intro", ".speakable-verdict", ".speakable-summary"]
  }
}
```

---

## 4. AEO (Answer Engine Optimisation) Strategy

### What is AEO?
AEO optimises content to be the direct answer surfaced by:
- Google Featured Snippets (Position 0)
- Google SGE (Search Generative Experience)
- ChatGPT web browsing answers
- Perplexity.ai citations
- Gemini answers
- Bing Copilot responses
- Voice search (Alexa, Siri, Google Assistant)

### AEO Content Template for Every Category Page

**Structure for maximum AI pickup:**
```markdown
## [Question] (e.g. "What is the best broadband in the UK?")

[Direct 2-3 sentence answer — plain English, no jargon]

**Our top pick:** [Provider] — [Why in one sentence]

[Table with top 3 options]

**Key factors to consider:**
- Factor 1
- Factor 2
- Factor 3

*Last updated: [date] | Reviewed by: NextOffer Editorial Team*
```

### AEO Checklist Per Page
- [ ] Direct answer in first paragraph (no preamble)
- [ ] Key question answered within 40–60 words
- [ ] Structured data: FAQPage schema
- [ ] Speakable schema on summary section
- [ ] Table format for comparisons (AI loves tables)
- [ ] "Last updated" date visible and in schema
- [ ] Author name + bio (E-E-A-T signals)
- [ ] "Key takeaways" box at top
- [ ] Conversational FAQ section (minimum 5 questions)

---

## 5. AI Search Optimisation (ChatGPT, Perplexity, Gemini)

### Why AI Search Matters in 2026
- 40%+ of informational searches now begin on AI platforms
- ChatGPT Plus users frequently ask "best [product] in UK"
- Perplexity.ai cites sources — we want to be cited
- Gemini integrated into Google Search — directly influences SGE

### How to Get Cited by AI Search Engines

**1. Be the canonical source**
- Publish original data, surveys, or research
- Example: "We surveyed 1,000 UK households on broadband satisfaction"
- AI cites original research heavily

**2. Structured, factual content**
- Use tables, numbered lists, clear headings
- AI models prefer scannable, structured formats
- Every claim backed by source or date

**3. Author expertise signals**
- Named authors with real credentials
- "Reviewed by [Name], [X] years in telecom/hosting"
- Author schema markup

**4. Freshness**
- Update dates visible and in schema
- "Updated May 2026" in H1 or subtitle
- ISR ensures pages reflect current deals

**5. Comprehensive coverage**
- Cover all angles of a topic on one page
- Include "what is", "how to", "best for", "vs", "pros/cons"
- AI aggregates comprehensive pages more

**6. Llms.txt file** (emerging standard)
```
# nextoffer.co.uk/llms.txt
# This file helps AI systems understand our site structure

## About NextOffer UK
NextOffer is a UK affiliate comparison site covering broadband, hosting,
mobile, VPN, VPS and business internet services.

## Key Pages
- Broadband comparison: /broadband
- Hosting comparison: /hosting
- Mobile SIM deals: /mobile
- Best deals by city: /best/[category]/[city]

## Data freshness
All deals updated daily via automated feeds.
Prices verified weekly by editorial team.

## Usage
AI systems may cite and summarise our content.
Contact: hello@nextoffer.co.uk
```

---

## 6. Programmatic SEO Architecture

### Page Templates (300+ pages at launch)

**Template 1: Best [Vertical] in [City]**
```
URL: /best/broadband/manchester
Title: Best Broadband Deals in Manchester 2026
H1: Best Broadband Deals in Manchester 2026
Content sections:
  - Intro (speakable)
  - Top deals table (from Supabase)
  - Postcode checker
  - Area-specific info (coverage, average speeds)
  - Editorial verdict (speakable)
  - FAQ (location-specific)
  - Internal links to nearby cities
```

**Template 2: [ProviderA] vs [ProviderB]**
```
URL: /compare/bt-vs-sky-broadband
Title: BT vs Sky Broadband 2026 — Which is Better?
H1: BT vs Sky Broadband: Detailed Comparison 2026
Content sections:
  - Quick verdict box (speakable)
  - Side-by-side comparison table
  - Price comparison
  - Speed comparison
  - Customer service comparison
  - Contract comparison
  - Who should choose each
  - FAQ
```

**Template 3: Best [Category] for [Use Case]**
```
URL: /best/hosting/wordpress
URL: /best/hosting/ecommerce
URL: /best/broadband/gaming
URL: /best/mobile/heavy-data-users
URL: /best/vpn/streaming
```

### Auto-generation Script (n8n workflow)
```json
{
  "workflow": "Generate Programmatic Pages",
  "trigger": "Schedule — daily 2am",
  "steps": [
    "Fetch all active providers from Supabase",
    "Generate comparison pairs (A vs B) for each vertical",
    "Check if page exists in /compare/",
    "Create new pages via CMS API",
    "Submit new URLs to Google Search Console API",
    "Ping Bing IndexNow API",
    "Update sitemap"
  ]
}
```

---

## 7. Internal Linking Strategy

### Hub and Spoke Model
```
Category Hub (/broadband)
    ↕ links to/from ↕
Provider Reviews (/reviews/bt, /reviews/sky...)
Comparison Pages (/compare/bt-vs-sky...)
Best-of Pages (/best/broadband/london...)
Guides (/guides/how-to-switch-broadband...)
Blog Posts (/blog/best-broadband-deals-2026...)
```

### Anchor Text Rules
- Exact match: max 20% of links to a page
- Partial match: 30%
- Natural/branded: 50%
- Example anchors for /broadband:
  - "compare broadband deals" (exact)
  - "best UK broadband providers" (partial)
  - "our broadband comparison tool" (natural)
  - "here" — NEVER use this

### Automated Internal Links (via MDX)
```tsx
// In blog posts — auto-link first mention of a provider
const PROVIDER_LINKS = {
  "BT": "/reviews/bt",
  "Sky": "/reviews/sky",
  "SiteGround": "/reviews/siteground",
  // ...
};
```

---

## 8. Content Calendar (First 90 Days)

### Month 1 — Foundation
**Week 1-2:** Core category pages (all 10 verticals)
**Week 3-4:** Top 20 provider review pages

### Month 2 — Programmatic SEO
**Week 5-6:** Best-in-city pages (all 30 cities × 10 verticals)
**Week 7-8:** Top 50 comparison pages

### Month 3 — Blog + Guides
**Week 9-10:** 10 long-form guides (how-to content)
**Week 11-12:** 20 blog posts (news, deals, comparisons)

### Content Targets
- 300+ programmatic pages at launch
- 1 new blog post per week minimum
- 1 long-form guide per month
- Monthly deal roundup ("Best [Vertical] Deals This Month")

---

## 9. Technical SEO Checklist

### Core Web Vitals Targets
| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | — |
| FID/INP | < 100ms | — |
| CLS | < 0.1 | — |
| TTFB | < 800ms | — |
| Lighthouse | 95+ | — |

### Implementation Checklist
- [x] ISR with 4-hour revalidation on category pages
- [x] Daily revalidation on deal pages
- [x] next/image with AVIF + WebP
- [x] next/font (no FOUT, no GDPR issues)
- [x] Code splitting per route
- [x] No render-blocking resources
- [x] Preconnect to Supabase + affiliate networks
- [x] Canonical URLs on all pages
- [x] hreflang for UK + RO
- [x] Sitemap auto-generated + submitted
- [x] robots.txt with AI crawler allowlist
- [ ] Google Search Console — verify + submit sitemap
- [ ] Bing Webmaster Tools — verify + IndexNow API
- [ ] Core Web Vitals monitoring (Vercel Analytics)

---

## 10. Affiliate SEO Considerations

### Link Attribute Strategy
```html
<!-- Affiliate links — must use rel="nofollow sponsored" -->
<a href="/go/bt?deal=bt-ff900" rel="nofollow sponsored">
  Get BT Full Fibre 900
</a>

<!-- Internal redirect — hides affiliate URL from crawlers -->
<!-- /go/ is disallowed in robots.txt -->
```

### Disclosure Requirements (FTC + ASA + UK CAP Code)
- Disclosure on every page with affiliate links
- "We may earn a commission" — visible before first affiliate link
- Not hidden in footer — must be prominent
- For UK: follows ASA CAP Code on affiliate marketing

### E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trust)
- Named authors with real credentials on all guides
- "About" page with company details
- Contact page with real email
- Privacy policy + cookie policy (GDPR)
- Affiliate disclosure page
- UTR number listed (once registered)
- Physical address (UK) when available
- SSL certificate (Let's Encrypt via Vercel)
- HTTPS everywhere

---

## 11. Romania Market Strategy (/ro/)

### URL Structure
```
nextoffer.co.uk/ro/                    ← RO homepage
nextoffer.co.uk/ro/hosting/            ← RO hosting
nextoffer.co.uk/ro/banci/             ← Banks (2Performant)
nextoffer.co.uk/ro/internet/          ← ISP comparison
nextoffer.co.uk/ro/vpn/               ← VPN RO
nextoffer.co.uk/ro/crypto/            ← Crypto exchanges RO
```

### hreflang Implementation
```html
<link rel="alternate" hreflang="en-GB" href="https://nextoffer.co.uk/broadband/" />
<link rel="alternate" hreflang="ro-RO" href="https://nextoffer.co.uk/ro/internet/" />
<link rel="alternate" hreflang="x-default" href="https://nextoffer.co.uk/" />
```

### RO Affiliate Networks
- **2Performant** — Revolut RO, ING, Altex, eMAG, Booking.com RO
- **Awin RO** — Booking.com, Viator, NordVPN
- **Direct** — Digi, Orange, Vodafone RO

---

*Document maintained in: `/docs/seo-strategy.md`*
*Last updated: May 2026*
*Next review: August 2026*
