-- ─────────────────────────────────────────────────────────────────
-- nextoffer/supabase/migrations/001_initial_schema.sql
-- Full database schema for NextOffer UK affiliate platform
-- Run via: supabase db push
-- ─────────────────────────────────────────────────────────────────

-- ── Extensions ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- accent-insensitive search

-- ── Enums ─────────────────────────────────────────────────────────
CREATE TYPE vertical AS ENUM (
  'broadband', 'hosting', 'mobile', 'vps', 'business',
  'voip', 'vpn', 'domains', 'builders', 'ai',
  'banks', 'insurance', 'energy', 'travel', 'crypto'
);

CREATE TYPE market AS ENUM ('uk', 'ro');

CREATE TYPE affiliate_network AS ENUM (
  'awin', 'impact', 'shareasale', '2performant', 'direct'
);

CREATE TYPE commission_type AS ENUM ('cpa', 'cpl', 'revenue_share');

CREATE TYPE deal_badge AS ENUM (
  'Best Value', 'Most Popular', 'Editor''s Pick', 'Exclusive Deal',
  'Fastest', 'Cheapest', 'Top Rated', 'New', 'Limited Time'
);

-- ── Providers ─────────────────────────────────────────────────────
CREATE TABLE providers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  logo_url        TEXT,
  website         TEXT NOT NULL,
  vertical        vertical NOT NULL,
  markets         market[] NOT NULL DEFAULT '{uk}',
  rating          NUMERIC(3,2) CHECK (rating BETWEEN 0 AND 5),
  review_count    INTEGER DEFAULT 0,
  trust_score     INTEGER CHECK (trust_score BETWEEN 0 AND 100),
  description     TEXT,
  short_desc      TEXT,
  founded         INTEGER,
  headquarters    TEXT,
  featured        BOOLEAN DEFAULT false,
  verified        BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_providers_vertical   ON providers(vertical);
CREATE INDEX idx_providers_featured   ON providers(featured) WHERE featured = true;
CREATE INDEX idx_providers_slug       ON providers(slug);
CREATE INDEX idx_providers_search     ON providers USING GIN (to_tsvector('english', name || ' ' || COALESCE(short_desc, '')));

-- ── Deals ─────────────────────────────────────────────────────────
CREATE TABLE deals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id         UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  vertical            vertical NOT NULL,
  market              market NOT NULL DEFAULT 'uk',

  -- Pricing
  price               NUMERIC(10,2) NOT NULL,
  currency            CHAR(3) NOT NULL DEFAULT 'GBP',
  original_price      NUMERIC(10,2),
  contract_length     INTEGER,              -- months
  setup_fee           NUMERIC(10,2) DEFAULT 0,
  setup_fee_waived    BOOLEAN DEFAULT false,

  -- Specs (flexible JSON per vertical)
  specs               JSONB DEFAULT '{}'::jsonb,

  -- Affiliate
  affiliate_url       TEXT NOT NULL,
  affiliate_network   affiliate_network NOT NULL,
  affiliate_prog_id   TEXT,
  commission_type     commission_type DEFAULT 'cpa',
  commission_value    NUMERIC(10,2),

  -- Display
  badge               TEXT,
  badge_color         TEXT,
  highlight           TEXT,
  promo_code          TEXT,
  promo_expiry        TIMESTAMPTZ,

  -- Status
  is_active           BOOLEAN DEFAULT true,
  is_featured         BOOLEAN DEFAULT false,
  is_exclusive        BOOLEAN DEFAULT false,
  expires_at          TIMESTAMPTZ,

  -- SEO
  meta_title          TEXT,
  meta_description    TEXT,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_provider      ON deals(provider_id);
CREATE INDEX idx_deals_vertical      ON deals(vertical);
CREATE INDEX idx_deals_market        ON deals(market);
CREATE INDEX idx_deals_active        ON deals(is_active) WHERE is_active = true;
CREATE INDEX idx_deals_featured      ON deals(is_featured) WHERE is_featured = true;
CREATE INDEX idx_deals_price         ON deals(price);
CREATE INDEX idx_deals_updated       ON deals(updated_at DESC);
CREATE INDEX idx_deals_specs         ON deals USING GIN (specs);

-- ── Reviews ───────────────────────────────────────────────────────
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  deal_id         UUID REFERENCES deals(id) ON DELETE SET NULL,
  author          TEXT NOT NULL,
  author_verified BOOLEAN DEFAULT false,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  pros            TEXT[],
  cons            TEXT[],
  vertical        vertical NOT NULL,
  market          market NOT NULL DEFAULT 'uk',
  helpful         INTEGER DEFAULT 0,
  is_approved     BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_reviews_rating   ON reviews(rating);

-- ── Blog Posts ────────────────────────────────────────────────────
CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,           -- MDX content
  category        TEXT NOT NULL,
  markets         market[] DEFAULT '{uk}',
  author_id       UUID,
  featured_image  TEXT,
  tags            TEXT[],
  reading_time    INTEGER,        -- minutes
  published_at    TIMESTAMPTZ,
  is_published    BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  no_index        BOOLEAN DEFAULT false,
  meta_title      TEXT,
  meta_desc       TEXT,
  canonical_url   TEXT,
  last_reviewed   DATE,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_posts_category  ON posts(category);
CREATE INDEX idx_posts_tags      ON posts USING GIN (tags);
CREATE INDEX idx_posts_search    ON posts USING GIN (to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- ── FAQ Items ─────────────────────────────────────────────────────
CREATE TABLE faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    vertical,
  market      market DEFAULT 'uk',
  post_id     UUID REFERENCES posts(id) ON DELETE SET NULL,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_category ON faqs(category);

-- ── Affiliate Clicks (Analytics) ──────────────────────────────────
CREATE TABLE affiliate_clicks (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id           UUID REFERENCES deals(id) ON DELETE SET NULL,
  provider_id       UUID REFERENCES providers(id) ON DELETE SET NULL,
  vertical          vertical,
  network           affiliate_network,
  session_id        TEXT,
  referrer          TEXT,
  user_agent        TEXT,
  ip_country        CHAR(2),
  clicked_at        TIMESTAMPTZ DEFAULT NOW(),
  converted         BOOLEAN DEFAULT false,
  conversion_value  NUMERIC(10,2),
  conversion_at     TIMESTAMPTZ
);

-- Partition by month for performance at scale
CREATE INDEX idx_clicks_clicked_at  ON affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_clicks_deal        ON affiliate_clicks(deal_id);
CREATE INDEX idx_clicks_session     ON affiliate_clicks(session_id);
CREATE INDEX idx_clicks_converted   ON affiliate_clicks(converted) WHERE converted = true;

-- ── UK Locations (for programmatic SEO) ──────────────────────────
CREATE TABLE uk_locations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  lat                 NUMERIC(9,6),
  lng                 NUMERIC(9,6),
  region              TEXT,
  postcode_prefixes   TEXT[],
  population          INTEGER,
  is_active           BOOLEAN DEFAULT true
);

CREATE INDEX idx_locations_slug   ON uk_locations(slug);
CREATE INDEX idx_locations_region ON uk_locations(region);

-- ── Provider <> Location availability ────────────────────────────
CREATE TABLE provider_locations (
  provider_id   UUID REFERENCES providers(id) ON DELETE CASCADE,
  location_id   UUID REFERENCES uk_locations(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, location_id)
);

-- ── Email Subscribers (lead capture) ─────────────────────────────
CREATE TABLE subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  market        market DEFAULT 'uk',
  vertical      vertical,           -- what they signed up for
  source        TEXT,               -- e.g. 'broadband-page', 'popup'
  gdpr_consent  BOOLEAN NOT NULL DEFAULT false,
  consented_at  TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscribers_market ON subscribers(market);

-- ── Comparison Pages (cached) ─────────────────────────────────────
CREATE TABLE comparisons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  vertical      vertical NOT NULL,
  market        market DEFAULT 'uk',
  provider_a_id UUID REFERENCES providers(id),
  provider_b_id UUID REFERENCES providers(id),
  deal_a_id     UUID REFERENCES deals(id),
  deal_b_id     UUID REFERENCES deals(id),
  verdict       TEXT,
  summary       TEXT,
  winner        CHAR(1) CHECK (winner IN ('a', 'b', 't')),
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comparisons_vertical ON comparisons(vertical);
CREATE INDEX idx_comparisons_slug     ON comparisons(slug);

-- ── Triggers: auto-update updated_at ─────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER deals_updated_at     BEFORE UPDATE ON deals     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reviews_updated_at   BEFORE UPDATE ON reviews   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER posts_updated_at     BEFORE UPDATE ON posts     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Triggers: auto-update provider rating from reviews ────────────
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers SET
    rating       = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews WHERE provider_id = NEW.provider_id AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id AND is_approved = true),
    updated_at   = NOW()
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE providers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers       ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read providers"        ON providers        FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active deals"     ON deals            FOR SELECT USING (is_active = true);
CREATE POLICY "Public read approved reviews" ON reviews          FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read published posts"  ON posts            FOR SELECT USING (is_published = true);

-- Inserts allowed (for tracking & lead capture)
CREATE POLICY "Allow click tracking"   ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow email subscribe"  ON subscribers      FOR INSERT WITH CHECK (gdpr_consent = true);

-- ── Useful views ──────────────────────────────────────────────────
CREATE VIEW top_deals AS
SELECT d.*, p.name AS provider_name, p.logo_url, p.rating, p.review_count
FROM deals d
JOIN providers p ON d.provider_id = p.id
WHERE d.is_active = true AND d.is_featured = true
ORDER BY p.rating DESC, d.price ASC;

CREATE VIEW category_stats AS
SELECT
  vertical,
  COUNT(*) AS deal_count,
  MIN(price) AS min_price,
  MAX(price) AS max_price,
  ROUND(AVG(price)::NUMERIC, 2) AS avg_price,
  COUNT(DISTINCT provider_id) AS provider_count
FROM deals
WHERE is_active = true
GROUP BY vertical;

-- ── Seed: UK Locations ────────────────────────────────────────────
INSERT INTO uk_locations (name, slug, lat, lng, region, postcode_prefixes, population) VALUES
('London',        'london',        51.5074, -0.1278,  'Greater London',        '{E,EC,N,NW,SE,SW,W,WC}', 8982000),
('Manchester',    'manchester',    53.4808, -2.2426,  'Greater Manchester',    '{M}',                    553230),
('Birmingham',    'birmingham',    52.4862, -1.8904,  'West Midlands',         '{B}',                    1141374),
('Leeds',         'leeds',         53.8008, -1.5491,  'West Yorkshire',        '{LS}',                   789194),
('Glasgow',       'glasgow',       55.8642, -4.2518,  'Scotland',              '{G}',                    633120),
('Liverpool',     'liverpool',     53.4084, -2.9916,  'Merseyside',            '{L}',                    498042),
('Bristol',       'bristol',       51.4545, -2.5879,  'South West England',    '{BS}',                   467099),
('Sheffield',     'sheffield',     53.3811, -1.4701,  'South Yorkshire',       '{S}',                    584853),
('Edinburgh',     'edinburgh',     55.9533, -3.1883,  'Scotland',              '{EH}',                   524930),
('Cardiff',       'cardiff',       51.4816, -3.1791,  'Wales',                 '{CF}',                   362756),
('Nottingham',    'nottingham',    52.9548, -1.1581,  'East Midlands',         '{NG}',                   321500),
('Leicester',     'leicester',     52.6369, -1.1398,  'East Midlands',         '{LE}',                   354224),
('Cambridge',     'cambridge',     52.2053,  0.1218,  'East of England',       '{CB}',                   145700),
('Oxford',        'oxford',        51.7520, -1.2577,  'South East England',    '{OX}',                   171380),
('Brighton',      'brighton',      50.8225, -0.1372,  'South East England',    '{BN}',                   229700),
('Southampton',   'southampton',   50.9097, -1.4044,  'South East England',    '{SO}',                   269781),
('Newcastle',     'newcastle',     54.9783, -1.6178,  'North East England',    '{NE}',                   302820),
('Belfast',       'belfast',       54.5973, -5.9301,  'Northern Ireland',      '{BT}',                   341877);
