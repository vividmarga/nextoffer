"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label:"Broadband", href:"/broadband" },
  { label:"Hosting",   href:"/hosting"   },
  { label:"Mobile",    href:"/mobile"    },
  { label:"VPN",       href:"/vpn"       },
  { label:"Deals",     href:"/deals"     },
  { label:"Blog",      href:"/blog"      },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header
      role="banner"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(5,6,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <div className="container">
        <nav
          aria-label="Main navigation"
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}
        >
          {/* Logo */}
          <a href="/" aria-label="NextOffer UK — Home" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:"linear-gradient(135deg,#00D4AA,#9B8FFF)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
            }}>⚡</div>
            <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:18, color:"#F5F4EF" }}>
              NextOffer
            </span>
            <span style={{
              fontSize:10, fontWeight:600, letterSpacing:"0.06em",
              background:"rgba(0,212,170,0.15)", color:"#00D4AA",
              padding:"2px 7px", borderRadius:10, border:"1px solid rgba(0,212,170,0.3)",
            }}>UK</span>
          </a>

          {/* Desktop nav */}
          <ul style={{ display:"flex", gap:28, alignItems:"center", listStyle:"none", margin:0, padding:0 }}
            className="hidden md:flex">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} style={{
                  color:"#8B8FA8", fontSize:14, fontWeight:500,
                  textDecoration:"none", transition:"color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color="#F5F4EF")}
                  onMouseLeave={e => (e.currentTarget.style.color="#8B8FA8")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }} className="hidden md:flex">
            <span style={{ color:"#8B8FA8", fontSize:13 }}>🇬🇧 UK</span>
            <a href="/compare" className="btn-primary" style={{ padding:"9px 20px", fontSize:13 }}>
              Compare Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background:"transparent", border:"none", cursor:"pointer",
              color:"#F5F4EF", padding:8, display:"flex", flexDirection:"column", gap:5,
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display:"block", width:22, height:2, background:"currentColor", borderRadius:2,
                transition:"all 0.25s ease",
                transform: menuOpen
                  ? i===0 ? "rotate(45deg) translateY(7px)"
                  : i===2 ? "rotate(-45deg) translateY(-7px)"
                  : "scaleX(0)"
                  : "none",
              }} />
            ))}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div style={{
        overflow:"hidden",
        maxHeight: menuOpen ? 400 : 0,
        transition:"max-height 0.35s ease",
        background:"rgba(5,6,15,0.98)",
        borderTop: menuOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}>
        <div className="container" style={{ paddingTop:16, paddingBottom:20 }}>
          <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:4 }}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)} style={{
                  display:"block", color:"#8B8FA8", fontSize:15,
                  fontWeight:500, textDecoration:"none",
                  padding:"10px 0",
                  borderBottom:"1px solid rgba(255,255,255,0.05)",
                  transition:"color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color="#F5F4EF")}
                  onMouseLeave={e => (e.currentTarget.style.color="#8B8FA8")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/compare" className="btn-primary" style={{ display:"block", textAlign:"center", marginTop:16 }}>
            Compare Now →
          </a>
        </div>
      </div>
    </header>
  );
}
