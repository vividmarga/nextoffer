const FOOTER_LINKS = {
  Services: [
    { label:"Broadband",     href:"/broadband" },
    { label:"Web Hosting",   href:"/hosting"   },
    { label:"Mobile SIM",    href:"/mobile"    },
    { label:"VPS & Cloud",   href:"/vps"       },
    { label:"VPN",           href:"/vpn"       },
    { label:"Business Net",  href:"/business"  },
    { label:"VoIP",          href:"/voip"      },
    { label:"Domains",       href:"/domains"   },
  ],
  Resources: [
    { label:"Blog",          href:"/blog"      },
    { label:"Guides",        href:"/guides"    },
    { label:"Reviews",       href:"/reviews"   },
    { label:"Best Of",       href:"/best"      },
    { label:"Today's Deals", href:"/deals"     },
    { label:"AI Picks",      href:"/ai-picks"  },
    { label:"Compare",       href:"/compare"   },
  ],
  Company: [
    { label:"About Us",      href:"/about"     },
    { label:"Contact",       href:"/contact"   },
    { label:"Privacy Policy",href:"/privacy"   },
    { label:"Cookie Policy", href:"/cookies"   },
    { label:"GDPR",          href:"/gdpr"      },
    { label:"Affiliate Disclosure", href:"/about/affiliate-disclosure" },
    { label:"Terms",         href:"/terms"     },
  ],
};

const AFFILIATE_NETWORKS = ["Awin", "Impact", "ShareASale", "2Performant"];

const CATEGORY_LINKS = [
  { label:"Best Broadband London",     href:"/best/broadband/london"     },
  { label:"Best Broadband Manchester", href:"/best/broadband/manchester"  },
  { label:"Best Hosting UK",           href:"/hosting"                    },
  { label:"BT vs Sky Broadband",       href:"/compare/bt-vs-sky"          },
  { label:"NordVPN vs ExpressVPN",     href:"/compare/nordvpn-vs-expressvpn" },
  { label:"Cheapest SIM Only UK",      href:"/mobile"                     },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      style={{
        background:"rgba(255,255,255,0.01)",
        borderTop:"1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Main footer grid */}
      <div className="container" style={{ paddingTop:56, paddingBottom:40 }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}
          className="footer-grid">

          {/* Brand col */}
          <div>
            <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:16 }}>
              <div style={{
                width:32, height:32, borderRadius:8,
                background:"linear-gradient(135deg,#00D4AA,#9B8FFF)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
              }}>⚡</div>
              <span style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:18, color:"#F5F4EF" }}>
                NextOffer <span style={{ color:"#00D4AA", fontSize:12, fontWeight:500 }}>UK</span>
              </span>
            </a>

            <p style={{ color:"#8B8FA8", fontSize:14, lineHeight:1.7, maxWidth:280, marginBottom:20 }}>
              UK&apos;s most trusted comparison platform for broadband, hosting, mobile and more.
              We earn affiliate commissions — always disclosed.
            </p>

            {/* Affiliate network badges */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              {AFFILIATE_NETWORKS.map(n => (
                <span key={n} style={{
                  fontSize:11, color:"#8B8FA8",
                  border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:6, padding:"3px 8px",
                }}>
                  {n}
                </span>
              ))}
            </div>

            {/* Affiliate disclosure snippet */}
            <p style={{ color:"#3A3D52", fontSize:12, lineHeight:1.6, maxWidth:280 }}>
              We may earn commissions when you click links on this site.{" "}
              <a href="/about/affiliate-disclosure" style={{ color:"#8B8FA8", textDecoration:"underline" }}>
                Learn more
              </a>
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{
                fontFamily:"var(--font-display)", fontWeight:700, fontSize:11,
                color:"#F5F4EF", letterSpacing:"0.08em", textTransform:"uppercase",
                marginBottom:16,
              }}>
                {title}
              </div>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:8 }}>
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} style={{
                      color:"#8B8FA8", fontSize:14, textDecoration:"none", transition:"color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color="#F5F4EF")}
                      onMouseLeave={e => (e.currentTarget.style.color="#8B8FA8")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Internal links for SEO */}
        <div style={{
          borderTop:"1px solid rgba(255,255,255,0.05)",
          paddingTop:24, paddingBottom:24,
        }}>
          <div style={{ fontSize:11, color:"#3A3D52", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>
            Popular pages
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 16px" }}>
            {CATEGORY_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{
                color:"#3A3D52", fontSize:12, textDecoration:"none", transition:"color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color="#8B8FA8")}
                onMouseLeave={e => (e.currentTarget.style.color="#3A3D52")}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:"1px solid rgba(255,255,255,0.05)",
          paddingTop:20,
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
        }}>
          <span style={{ color:"#3A3D52", fontSize:12 }}>
            © {year} NextOffer UK. All rights reserved. Affiliate disclosures apply.
          </span>
          <div style={{ display:"flex", gap:16 }}>
            <a href="/privacy" style={{ color:"#3A3D52", fontSize:12, textDecoration:"none" }}>Privacy</a>
            <a href="/cookies" style={{ color:"#3A3D52", fontSize:12, textDecoration:"none" }}>Cookies</a>
            <a href="/terms"   style={{ color:"#3A3D52", fontSize:12, textDecoration:"none" }}>Terms</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
