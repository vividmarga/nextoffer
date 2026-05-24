// ─────────────────────────────────────────────────────────────────
// IMPORTANT FOR CLOUDFLARE PAGES:
// All API routes MUST declare Edge Runtime
// ─────────────────────────────────────────────────────────────────
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const PROVIDER_DESTINATIONS: Record<string, { url: string; network: string; merchantId: string }> = {
  bt:          { url: "https://www.bt.com/broadband",          network: "awin",       merchantId: "7154"    },
  sky:         { url: "https://www.sky.com/shop/broadband",    network: "awin",       merchantId: "2103"    },
  virginmedia: { url: "https://www.virginmedia.com/broadband", network: "awin",       merchantId: "1438"    },
  siteground:  { url: "https://www.siteground.co.uk",          network: "awin",       merchantId: "6094"    },
  kinsta:      { url: "https://kinsta.com",                    network: "impact",     merchantId: "1899611" },
  cloudways:   { url: "https://www.cloudways.com",             network: "impact",     merchantId: "1760923" },
  wpengine:    { url: "https://wpengine.com",                  network: "shareasale", merchantId: "41438"   },
  nordvpn:     { url: "https://nordvpn.com",                   network: "impact",     merchantId: "1875474" },
  expressvpn:  { url: "https://www.expressvpn.com",            network: "impact",     merchantId: "1457242" },
  namecheap:   { url: "https://www.namecheap.com",             network: "impact",     merchantId: "1876462" },
  hostinger:   { url: "https://www.hostinger.co.uk",           network: "impact",     merchantId: "2165835" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const dealId   = searchParams.get("deal") || "unknown";

  if (!provider || !PROVIDER_DESTINATIONS[provider]) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }

  const dest    = PROVIDER_DESTINATIONS[provider];
  const pubId   = request.headers.get("x-awin-pub") ||
                  (globalThis as Record<string, unknown>).AWIN_PUBLISHER_ID as string ||
                  process.env.AWIN_PUBLISHER_ID || "";

  const clickRef = `nextoffer_${provider}_${dealId}_${Date.now()}`;

  let affiliateUrl: string;
  switch (dest.network) {
    case "awin":
      affiliateUrl = `https://www.awin1.com/cread.php?awinmid=${dest.merchantId}&awinaffid=${pubId}&clickref=${clickRef}&p=${encodeURIComponent(dest.url)}`;
      break;
    case "impact":
      affiliateUrl = `https://impact.go2cloud.org/aff_c?offer_id=${dest.merchantId}&aff_id=${pubId}&url=${encodeURIComponent(dest.url)}&aff_sub=${clickRef}`;
      break;
    case "shareasale":
      affiliateUrl = `https://www.shareasale.com/r.cfm?b=0&u=${pubId}&m=${dest.merchantId}&urllink=${encodeURIComponent(dest.url)}&afftrack=${clickRef}`;
      break;
    default:
      affiliateUrl = dest.url;
  }

  // Fire-and-forget click tracking to Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const userAgent   = request.headers.get("user-agent") || "";
  const isBot       = /bot|crawler|spider|headless/i.test(userAgent);

  if (!isBot && supabaseUrl && supabaseKey) {
    const ipCountry = request.headers.get("cf-ipcountry") || "XX";
    fetch(`${supabaseUrl}/rest/v1/affiliate_clicks`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        session_id: clickRef,
        network:    dest.network,
        ip_country: ipCountry !== "XX" ? ipCountry : null,
        clicked_at: new Date().toISOString(),
        converted:  false,
      }),
    }).catch(() => {}); // silent fail
  }

  const response = NextResponse.redirect(affiliateUrl, { status: 302 });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}
