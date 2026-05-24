"use client";

import { useState } from "react";
import type { Deal } from "@/types";

const VERTICAL_COLORS: Record<string, string> = {
  broadband: "#00D4AA",
  hosting:   "#9B8FFF",
  mobile:    "#FFB547",
  vpn:       "#00D4AA",
  vps:       "#FF6B6B",
  business:  "#4ECDC4",
  voip:      "#45B7D1",
  domains:   "#FFEAA7",
  builders:  "#DDA0DD",
  ai:        "#FF9FF3",
};

interface DealCardProps {
  deal: Deal;
  showVertical?: boolean;
  compact?: boolean;
}

export default function DealCard({ deal, showVertical = false, compact = false }: DealCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = deal.badgeColor || VERTICAL_COLORS[deal.vertical] || "#00D4AA";

  function handleClick() {
    // Fire-and-forget tracking
    const sid = typeof window !== "undefined"
      ? (sessionStorage.getItem("nextoffer_sid") || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`)
      : "ssr";
    if (typeof window !== "undefined") sessionStorage.setItem("nextoffer_sid", sid);

    fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dealId: deal.id,
        providerId: deal.providerId,
        vertical: deal.vertical,
        network: deal.affiliateNetwork,
        sessionId: sid,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  if (compact) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? accent + "50" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 14,
          padding: "14px 16px",
          transition: "all 0.22s ease",
          transform: hovered ? "translateY(-2px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background:`${accent}20`, color: accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:12,
          }}>
            {deal.provider.name.charAt(0)}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"#F5F4EF", fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {deal.title}
            </div>
            {deal.highlight && (
              <div style={{ color:"#8B8FA8", fontSize:11, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {deal.highlight}
              </div>
            )}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:16, color:"#F5F4EF" }}>
            £{deal.price.toFixed(2)}<span style={{ fontSize:10, fontWeight:400, color:"#8B8FA8" }}>/mo</span>
          </span>
          <a
            href={`/go/${deal.providerId}?deal=${deal.id}`}
            rel="nofollow sponsored"
            onClick={handleClick}
            style={{
              background: accent, color:"#05060F",
              fontSize:11, fontWeight:700,
              padding:"6px 12px", borderRadius:8,
              textDecoration:"none", whiteSpace:"nowrap",
              transition:"opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity="0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity="1")}
          >
            Get →
          </a>
        </div>
      </div>
    );
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Deal: ${deal.title} from ${deal.provider.name}`}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? accent + "45" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: 24,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.4)` : "none",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow accent */}
      <div style={{
        position:"absolute", top:0, right:0,
        width:80, height:80, pointerEvents:"none",
        background:`radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
      }} />

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:40, height:40, borderRadius:10,
            background:`${accent}18`, color: accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:14,
          }}>
            {deal.provider.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F5F4EF", fontSize:15 }}>
              {deal.provider.name}
            </div>
            {showVertical && (
              <div style={{ color:"#8B8FA8", fontSize:11, textTransform:"capitalize" }}>
                {deal.vertical}
              </div>
            )}
          </div>
        </div>

        {deal.badge && (
          <span style={{
            fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
            background:`${accent}18`, color: accent,
            padding:"3px 9px", borderRadius:20, border:`1px solid ${accent}35`,
          }}>
            {deal.badge}
          </span>
        )}
      </div>

      {/* Title + highlight */}
      <div>
        <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"#F5F4EF", fontSize:16, marginBottom:4 }}>
          {deal.title}
        </h3>
        {deal.highlight && (
          <p style={{ color:"#8B8FA8", fontSize:13, lineHeight:1.5 }}>{deal.highlight}</p>
        )}
      </div>

      {/* Key specs */}
      {Object.keys(deal.specs).length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 16px" }}>
          {deal.specs.downloadSpeed && (
            <span style={{ color:"#8B8FA8", fontSize:12 }}>
              <span style={{ color:"#F5F4EF", fontWeight:600 }}>{String(deal.specs.downloadSpeed)}Mbps</span> speed
            </span>
          )}
          {deal.specs.technology && (
            <span style={{ color:"#8B8FA8", fontSize:12 }}>
              <span style={{ color:"#F5F4EF", fontWeight:600 }}>{String(deal.specs.technology)}</span>
            </span>
          )}
          {deal.specs.storage && (
            <span style={{ color:"#8B8FA8", fontSize:12 }}>
              <span style={{ color:"#F5F4EF", fontWeight:600 }}>{String(deal.specs.storage)}GB</span> storage
            </span>
          )}
          {deal.specs.data && (
            <span style={{ color:"#8B8FA8", fontSize:12 }}>
              <span style={{ color:"#F5F4EF", fontWeight:600 }}>{String(deal.specs.data)}</span> data
            </span>
          )}
          {deal.specs.uptime && (
            <span style={{ color:"#8B8FA8", fontSize:12 }}>
              <span style={{ color:"#F5F4EF", fontWeight:600 }}>{String(deal.specs.uptime)}%</span> uptime
            </span>
          )}
        </div>
      )}

      {/* Price + CTA */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:"auto",
      }}>
        <div>
          {deal.originalPrice && (
            <div style={{ color:"#3A3D52", fontSize:12, textDecoration:"line-through" }}>
              £{deal.originalPrice.toFixed(2)}/mo
            </div>
          )}
          <div>
            <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:26, color:"#F5F4EF" }}>
              £{deal.price.toFixed(2)}
            </span>
            <span style={{ color:"#8B8FA8", fontSize:13 }}>/mo</span>
          </div>
          {deal.contractLength && (
            <div style={{ color:"#8B8FA8", fontSize:11, marginTop:2 }}>
              {deal.contractLength}-month contract
            </div>
          )}
          {deal.setupFeeWaived && (
            <div style={{ fontSize:11, marginTop:2, color: accent }}>✓ Free setup</div>
          )}
          {deal.promoCode && (
            <div style={{ fontSize:11, marginTop:3 }}>
              Code: <span style={{
                fontFamily:"var(--font-display)", fontWeight:700, color: accent,
                background:`${accent}15`, padding:"1px 6px", borderRadius:4,
              }}>{deal.promoCode}</span>
            </div>
          )}
        </div>

        <a
          href={`/go/${deal.providerId}?deal=${deal.id}`}
          rel="nofollow sponsored"
          onClick={handleClick}
          className="affiliate-link"
          aria-label={`Get ${deal.title} from ${deal.provider.name} — £${deal.price.toFixed(2)}/mo`}
          style={{
            background: hovered ? accent : `${accent}22`,
            color: hovered ? "#05060F" : accent,
            border: `1px solid ${accent}50`,
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 13, fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          Get Deal →
        </a>
      </div>

      {/* Rating */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ color:"#FFB547", fontSize:12 }}>
            {"★".repeat(Math.round(deal.provider.rating))}{"☆".repeat(5 - Math.round(deal.provider.rating))}
          </span>
          <span style={{ color:"#8B8FA8", fontSize:11 }}>
            {deal.provider.rating} ({deal.provider.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
        {deal.isExclusive && (
          <span style={{ fontSize:10, color:"#FFB547", fontWeight:600 }}>⚡ EXCLUSIVE</span>
        )}
      </div>
    </article>
  );
}
