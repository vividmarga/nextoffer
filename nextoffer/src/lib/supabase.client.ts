// ─────────────────────────────────────────────────────────────────
// nextoffer/src/lib/supabase.client.ts
// Typed Supabase clients — server components, client components, admin
// ─────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import type { Deal, Provider, Review, Post, Vertical, Market, DealFilters } from "@/types";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Public client (browser + server components — anon key) ────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false },
});

// ── Admin client (API routes only — service role key) ─────────────
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SVC, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─────────────────────────────────────────────────────────────────
// ── DATA ACCESS LAYER ─────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────

// ── Providers ─────────────────────────────────────────────────────

export async function getProviders(vertical?: Vertical, market: Market = "uk"): Promise<Provider[]> {
  let query = supabase
    .from("providers")
    .select("*")
    .eq("is_active", true)
    .contains("markets", [market])
    .order("featured", { ascending: false })
    .order("trust_score", { ascending: false });

  if (vertical) query = query.eq("vertical", vertical);

  const { data, error } = await query;
  if (error) { console.error("[supabase] getProviders:", error); return []; }
  return (data as Provider[]) || [];
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Provider;
}

export async function getFeaturedProviders(vertical: Vertical, limit = 6): Promise<Provider[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("vertical", vertical)
    .eq("featured", true)
    .eq("is_active", true)
    .order("trust_score", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Provider[]) || [];
}

// ── Deals ──────────────────────────────────────────────────────────

export async function getDeals(filters: DealFilters = {}): Promise<Deal[]> {
  let query = supabase
    .from("deals")
    .select(`*, provider:providers(*)`)
    .eq("is_active", true);

  if (filters.vertical)   query = query.eq("vertical", filters.vertical);
  if (filters.market)     query = query.eq("market", filters.market);
  if (filters.minPrice)   query = query.gte("price", filters.minPrice);
  if (filters.maxPrice)   query = query.lte("price", filters.maxPrice);
  if (filters.featured)   query = query.eq("is_featured", true);

  // Search
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  // Sorting
  switch (filters.sortBy) {
    case "price_asc":   query = query.order("price", { ascending: true }); break;
    case "price_desc":  query = query.order("price", { ascending: false }); break;
    case "rating":      query = query.order("providers.rating", { ascending: false }); break;
    case "newest":      query = query.order("created_at", { ascending: false }); break;
    default:            query = query.order("is_featured", { ascending: false }).order("price", { ascending: true });
  }

  // Pagination
  const page    = filters.page    || 1;
  const perPage = filters.perPage || 12;
  const from    = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, error } = await query;
  if (error) { console.error("[supabase] getDeals:", error); return []; }
  return (data as Deal[]) || [];
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from("deals")
    .select(`*, provider:providers(*)`)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Deal;
}

export async function getFeaturedDeals(vertical?: Vertical, limit = 9): Promise<Deal[]> {
  return getDeals({
    vertical,
    featured: true,
    perPage: limit,
    sortBy: "price_asc",
  });
}

// ── Reviews ────────────────────────────────────────────────────────

export async function getReviews(providerId: string, limit = 10): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("provider_id", providerId)
    .eq("is_approved", true)
    .order("helpful", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Review[]) || [];
}

export async function getProviderRating(providerId: string): Promise<{ rating: number; count: number }> {
  const { data, error } = await supabase
    .from("providers")
    .select("rating, review_count")
    .eq("id", providerId)
    .single();

  if (error || !data) return { rating: 0, count: 0 };
  return { rating: data.rating, count: data.review_count };
}

// ── Posts / Blog ───────────────────────────────────────────────────

export async function getPosts(params: {
  category?: string;
  market?: Market;
  limit?: number;
  page?: number;
  featured?: boolean;
} = {}): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (params.category) query = query.eq("category", params.category);
  if (params.featured)  query = query.eq("is_featured", true);
  if (params.market)    query = query.contains("markets", [params.market]);

  const limit = params.limit || 10;
  const page  = params.page  || 1;
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;
  if (error) return [];
  return (data as Post[]) || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data as Post;
}

// ── Search ─────────────────────────────────────────────────────────

export async function searchAll(query: string, market: Market = "uk") {
  const [providers, deals, posts] = await Promise.all([
    supabase
      .from("providers")
      .select("id, name, slug, vertical, short_desc, rating")
      .textSearch("name", query)
      .eq("is_active", true)
      .contains("markets", [market])
      .limit(5),

    supabase
      .from("deals")
      .select("id, title, slug, vertical, price, currency")
      .ilike("title", `%${query}%`)
      .eq("is_active", true)
      .eq("market", market)
      .limit(5),

    supabase
      .from("posts")
      .select("id, title, slug, excerpt, category")
      .textSearch("title", query)
      .eq("is_published", true)
      .limit(3),
  ]);

  return {
    providers: providers.data || [],
    deals:     deals.data     || [],
    posts:     posts.data     || [],
  };
}

// ── Stats ──────────────────────────────────────────────────────────

export async function getCategoryStats() {
  const { data, error } = await supabase
    .from("category_stats")  // view created in migration
    .select("*");

  if (error) return [];
  return data || [];
}

export async function getTotalClicksToday(): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const { count, error } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .gte("clicked_at", `${today}T00:00:00Z`);

  if (error) return 0;
  return count || 0;
}

// ── Subscribers (lead capture) ─────────────────────────────────────

export async function subscribeEmail(params: {
  email: string;
  market: Market;
  vertical?: Vertical;
  source: string;
}): Promise<{ ok: boolean; error?: string }> {
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
    return { ok: false, error: "Invalid email address" };
  }

  const { error } = await supabase.from("subscribers").insert({
    email:         params.email.toLowerCase().trim(),
    market:        params.market,
    vertical:      params.vertical || null,
    source:        params.source,
    gdpr_consent:  true,
    consented_at:  new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Already subscribed" };
    return { ok: false, error: "Subscription failed" };
  }

  return { ok: true };
}

// ── Sitemap data ───────────────────────────────────────────────────

export async function getSitemapData(): Promise<{
  providers: { slug: string; updatedAt: string }[];
  deals:     { slug: string; updatedAt: string }[];
  posts:     { slug: string; updatedAt: string }[];
}> {
  const [providers, deals, posts] = await Promise.all([
    supabase.from("providers").select("slug, updated_at").eq("is_active", true),
    supabase.from("deals").select("slug, updated_at").eq("is_active", true),
    supabase.from("posts").select("slug, updated_at").eq("is_published", true),
  ]);

  return {
    providers: (providers.data || []).map(p => ({ slug: p.slug, updatedAt: p.updated_at })),
    deals:     (deals.data     || []).map(d => ({ slug: d.slug, updatedAt: d.updated_at })),
    posts:     (posts.data     || []).map(p => ({ slug: p.slug, updatedAt: p.updated_at })),
  };
}
