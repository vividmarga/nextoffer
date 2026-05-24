// ─────────────────────────────────────────────────────────────────
// nextoffer/src/lib/comparison.engine.ts
// Deal comparison engine — scoring, ranking, VS pages logic
// ─────────────────────────────────────────────────────────────────

import type { Deal, Vertical } from "@/types";

// ── Scoring weights per vertical ──────────────────────────────────
const SCORING_WEIGHTS: Record<Vertical, {
  price: number;
  rating: number;
  speed?: number;
  value: number;
  trust: number;
}> = {
  broadband: { price: 0.35, rating: 0.25, speed: 0.25, value: 0.1, trust: 0.05 },
  hosting:   { price: 0.25, rating: 0.35, speed: 0.15, value: 0.15, trust: 0.1 },
  mobile:    { price: 0.30, rating: 0.25, speed: 0.20, value: 0.15, trust: 0.1 },
  vps:       { price: 0.20, rating: 0.30, speed: 0.25, value: 0.15, trust: 0.1 },
  vpn:       { price: 0.25, rating: 0.35, speed: 0.15, value: 0.15, trust: 0.1 },
  business:  { price: 0.20, rating: 0.30, speed: 0.20, value: 0.20, trust: 0.1 },
  voip:      { price: 0.25, rating: 0.35, speed: 0.10, value: 0.20, trust: 0.1 },
  domains:   { price: 0.50, rating: 0.20, speed: 0.00, value: 0.20, trust: 0.1 },
  builders:  { price: 0.25, rating: 0.35, speed: 0.00, value: 0.25, trust: 0.15 },
  ai:        { price: 0.30, rating: 0.30, speed: 0.00, value: 0.25, trust: 0.15 },
  banks:     { price: 0.20, rating: 0.30, speed: 0.00, value: 0.30, trust: 0.20 },
  insurance: { price: 0.30, rating: 0.25, speed: 0.00, value: 0.25, trust: 0.20 },
  energy:    { price: 0.45, rating: 0.20, speed: 0.00, value: 0.20, trust: 0.15 },
  travel:    { price: 0.30, rating: 0.30, speed: 0.00, value: 0.25, trust: 0.15 },
  crypto:    { price: 0.25, rating: 0.30, speed: 0.00, value: 0.25, trust: 0.20 },
};

// ── Composite score (0–100) ───────────────────────────────────────
export function scoreDeals(deals: Deal[]): (Deal & { score: number })[] {
  if (!deals.length) return [];

  const vertical = deals[0].vertical;
  const weights  = SCORING_WEIGHTS[vertical];

  // Normalise price (lower = better)
  const prices   = deals.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Normalise speed (from specs, higher = better)
  const speeds   = deals.map(d => Number(d.specs?.downloadSpeed || d.specs?.storage || 0));
  const maxSpeed = Math.max(...speeds) || 1;

  return deals
    .map(deal => {
      const priceScore  = 100 - ((deal.price - minPrice) / priceRange * 100);
      const ratingScore = (deal.provider.rating / 5) * 100;
      const speedScore  = maxSpeed > 0 ? (Number(deal.specs?.downloadSpeed || deal.specs?.storage || 0) / maxSpeed) * 100 : 50;
      const trustScore  = deal.provider.trustScore;
      const valueScore  = deal.originalPrice
        ? ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
        : 50;

      const score =
        priceScore  * weights.price  +
        ratingScore * weights.rating +
        speedScore  * (weights.speed || 0) +
        valueScore  * weights.value  +
        trustScore  * weights.trust;

      // Bonus for featured/exclusive
      const bonus = (deal.isFeatured ? 3 : 0) + (deal.isExclusive ? 5 : 0);

      return { ...deal, score: Math.min(100, Math.round(score + bonus)) };
    })
    .sort((a, b) => b.score - a.score);
}

// ── Head-to-head comparison ───────────────────────────────────────
export interface ComparisonResult {
  winner: "a" | "b" | "tie";
  verdict: string;
  categories: {
    name: string;
    winner: "a" | "b" | "tie";
    aValue: string;
    bValue: string;
    weight: "high" | "medium" | "low";
  }[];
  overallScoreA: number;
  overallScoreB: number;
  summary: string;
}

export function compareDeals(dealA: Deal, dealB: Deal): ComparisonResult {
  const vertical  = dealA.vertical;
  const weights   = SCORING_WEIGHTS[vertical];
  const categories: ComparisonResult["categories"] = [];

  // ── Price comparison ──────────────────────────────────────────
  categories.push({
    name: "Monthly Price",
    winner: dealA.price < dealB.price ? "a" : dealB.price < dealA.price ? "b" : "tie",
    aValue: `£${dealA.price.toFixed(2)}/mo`,
    bValue: `£${dealB.price.toFixed(2)}/mo`,
    weight: "high",
  });

  // ── Rating comparison ─────────────────────────────────────────
  categories.push({
    name: "Customer Rating",
    winner: dealA.provider.rating > dealB.provider.rating ? "a"
          : dealB.provider.rating > dealA.provider.rating ? "b" : "tie",
    aValue: `${dealA.provider.rating}/5 (${dealA.provider.reviewCount.toLocaleString()} reviews)`,
    bValue: `${dealB.provider.rating}/5 (${dealB.provider.reviewCount.toLocaleString()} reviews)`,
    weight: "high",
  });

  // ── Vertical-specific comparisons ────────────────────────────
  if (vertical === "broadband" || vertical === "mobile") {
    const speedA = Number(dealA.specs?.downloadSpeed || 0);
    const speedB = Number(dealB.specs?.downloadSpeed || 0);
    categories.push({
      name: "Download Speed",
      winner: speedA > speedB ? "a" : speedB > speedA ? "b" : "tie",
      aValue: `${speedA}Mbps`,
      bValue: `${speedB}Mbps`,
      weight: "high",
    });
  }

  if (vertical === "hosting" || vertical === "vps") {
    const storA = Number(dealA.specs?.storage || 0);
    const storB = Number(dealB.specs?.storage || 0);
    categories.push({
      name: "Storage",
      winner: storA > storB ? "a" : storB > storA ? "b" : "tie",
      aValue: `${storA}GB`,
      bValue: `${storB}GB`,
      weight: "medium",
    });
    const uptimeA = Number(dealA.specs?.uptime || 99.9);
    const uptimeB = Number(dealB.specs?.uptime || 99.9);
    categories.push({
      name: "Uptime Guarantee",
      winner: uptimeA > uptimeB ? "a" : uptimeB > uptimeA ? "b" : "tie",
      aValue: `${uptimeA}%`,
      bValue: `${uptimeB}%`,
      weight: "medium",
    });
  }

  // ── Contract length ───────────────────────────────────────────
  const contractA = dealA.contractLength || 0;
  const contractB = dealB.contractLength || 0;
  categories.push({
    name: "Contract Length",
    winner: contractA < contractB ? "a" : contractB < contractA ? "b" : "tie",
    aValue: contractA ? `${contractA} months` : "Rolling",
    bValue: contractB ? `${contractB} months` : "Rolling",
    weight: "medium",
  });

  // ── Setup fee ─────────────────────────────────────────────────
  const setupA = dealA.setupFeeWaived ? 0 : (dealA.setupFee || 0);
  const setupB = dealB.setupFeeWaived ? 0 : (dealB.setupFee || 0);
  categories.push({
    name: "Setup Fee",
    winner: setupA < setupB ? "a" : setupB < setupA ? "b" : "tie",
    aValue: setupA === 0 ? "Free" : `£${setupA.toFixed(2)}`,
    bValue: setupB === 0 ? "Free" : `£${setupB.toFixed(2)}`,
    weight: "low",
  });

  // ── Calculate weighted scores ─────────────────────────────────
  const scoreCategory = (cat: ComparisonResult["categories"][0]) => {
    const w = cat.weight === "high" ? 3 : cat.weight === "medium" ? 2 : 1;
    return { aPoints: cat.winner === "a" ? w : 0, bPoints: cat.winner === "b" ? w : 0 };
  };

  const totals = categories.reduce(
    (acc, cat) => {
      const { aPoints, bPoints } = scoreCategory(cat);
      return { a: acc.a + aPoints, b: acc.b + bPoints };
    },
    { a: 0, b: 0 }
  );

  const maxScore = categories.reduce((acc, cat) => acc + (cat.weight === "high" ? 3 : cat.weight === "medium" ? 2 : 1), 0);
  const overallScoreA = Math.round((totals.a / maxScore) * 100);
  const overallScoreB = Math.round((totals.b / maxScore) * 100);

  const winner: "a" | "b" | "tie" = overallScoreA > overallScoreB ? "a"
    : overallScoreB > overallScoreA ? "b" : "tie";

  // ── Auto-generate verdict ─────────────────────────────────────
  const winnerName = winner === "a" ? dealA.provider.name
    : winner === "b" ? dealB.provider.name
    : null;

  const verdict = winner === "tie"
    ? `${dealA.provider.name} and ${dealB.provider.name} are closely matched. Your choice should depend on your specific priorities.`
    : `${winnerName} wins this comparison. It scores better on ${categories.filter(c => (winner === "a" ? c.winner === "a" : c.winner === "b") && c.weight === "high").map(c => c.name.toLowerCase()).join(" and ")}.`;

  const summary = buildSummary(dealA, dealB, winner, vertical);

  return { winner, verdict, categories, overallScoreA, overallScoreB, summary };
}

function buildSummary(dealA: Deal, dealB: Deal, winner: "a" | "b" | "tie", vertical: Vertical): string {
  const priceDiff = Math.abs(dealA.price - dealB.price);
  const cheaper   = dealA.price < dealB.price ? dealA.provider.name : dealB.provider.name;

  if (vertical === "broadband") {
    return `${cheaper} is cheaper by £${priceDiff.toFixed(2)}/month (£${(priceDiff * 12).toFixed(0)}/year). ` +
      `Both offer unlimited data. Choose based on coverage in your area — enter your postcode above to check.`;
  }
  if (vertical === "hosting") {
    return `${cheaper} offers better value for most users. For high-traffic sites, prioritise uptime guarantees ` +
      `and support quality over price.`;
  }
  return `${cheaper} is cheaper by £${priceDiff.toFixed(2)}/month. Consider the full contract cost ` +
    `and customer service quality before deciding.`;
}

// ── Best deal finder (simple) ─────────────────────────────────────
export function findBestDeal(
  deals: Deal[],
  priority: "price" | "rating" | "speed" | "value" = "value"
): Deal | null {
  if (!deals.length) return null;

  switch (priority) {
    case "price":
      return deals.reduce((best, d) => d.price < best.price ? d : best);
    case "rating":
      return deals.reduce((best, d) => d.provider.rating > best.provider.rating ? d : best);
    case "speed":
      return deals.reduce((best, d) =>
        Number(d.specs?.downloadSpeed || 0) > Number(best.specs?.downloadSpeed || 0) ? d : best
      );
    case "value":
    default:
      return scoreDeals(deals)[0] || null;
  }
}

// ── Total contract cost calculator ────────────────────────────────
export function totalContractCost(deal: Deal): number {
  const months  = deal.contractLength || 12;
  const monthly = deal.price * months;
  const setup   = deal.setupFeeWaived ? 0 : (deal.setupFee || 0);
  return monthly + setup;
}

// ── Savings calculator ────────────────────────────────────────────
export function calculateSavings(currentPrice: number, newPrice: number, months = 12): {
  monthly: number;
  annual: number;
  total: number;
  percentOff: number;
} {
  const monthly    = currentPrice - newPrice;
  const annual     = monthly * 12;
  const total      = monthly * months;
  const percentOff = Math.round((monthly / currentPrice) * 100);
  return { monthly, annual, total, percentOff };
}

// ── Generate comparison slug ──────────────────────────────────────
export function comparisonSlug(providerA: string, providerB: string): string {
  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const [a, b]  = [slugify(providerA), slugify(providerB)].sort();
  return `${a}-vs-${b}`;
}

// ── Generate all comparison pairs for a vertical ──────────────────
export function generateComparisonPairs(providers: { slug: string; name: string }[]): {
  slug: string; providerA: string; providerB: string;
}[] {
  const pairs: { slug: string; providerA: string; providerB: string }[] = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      pairs.push({
        slug: comparisonSlug(providers[i].name, providers[j].name),
        providerA: providers[i].slug,
        providerB: providers[j].slug,
      });
    }
  }
  return pairs;
}
