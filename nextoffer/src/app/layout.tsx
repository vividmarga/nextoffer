import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { homepageMetadata } from "@/lib/seo.metadata";
import { organizationSchema, websiteSchema } from "@/lib/schema.helpers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#05060F" },
    { media: "(prefers-color-scheme: light)", color: "#05060F" },
  ],
};

export const metadata: Metadata = homepageMetadata();

const GLOBAL_SCHEMAS = [organizationSchema(), websiteSchema()];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {GLOBAL_SCHEMAS.map((schema, i) => (
          <script key={i} type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.awin1.com" />
        <link rel="dns-prefetch" href="https://impact.go2cloud.org" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-brand-navy text-brand-cream font-body antialiased min-h-screen">
        <a href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-brand-teal focus:text-brand-navy focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold">
          Skip to main content
        </a>

        <Navbar />

        <div id="main-content" style={{ paddingTop: 64 }}>
          {children}
        </div>

        <Footer />

        {/* GDPR Banner */}
        <div id="gdpr-banner" role="dialog" aria-label="Cookie consent" aria-modal="false"
          style={{ display:"none", position:"fixed", bottom:16, right:16, left:"auto", maxWidth:360, zIndex:150,
            background:"rgba(13,14,26,0.97)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:20,
            boxShadow:"0 16px 48px rgba(0,0,0,0.5)" }}>
          <p style={{ color:"#F5F4EF", fontSize:14, fontWeight:600, marginBottom:8 }}>🍪 We use cookies</p>
          <p style={{ color:"#8B8FA8", fontSize:12, lineHeight:1.6, marginBottom:16 }}>
            We use essential cookies to make the site work, and optional analytics cookies to improve your experience.
            We never sell your data.{" "}
            <a href="/privacy" style={{ color:"#00D4AA", textDecoration:"underline" }}>Privacy policy</a>
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <button id="gdpr-accept"
              style={{ flex:1, background:"#00D4AA", color:"#05060F", fontSize:12, fontWeight:700,
                padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer" }}>
              Accept all
            </button>
            <button id="gdpr-essential"
              style={{ flex:1, background:"transparent", color:"#8B8FA8", fontSize:12,
                padding:"9px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" }}>
              Essential only
            </button>
          </div>
        </div>

        {/* GDPR + Analytics script */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var KEY='nextoffer_consent';
  var c=localStorage.getItem(KEY);
  function loadGA(){
    var s=document.createElement('script');
    s.src='https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||""}';
    s.async=true; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);} window.gtag=gtag;
    gtag('js',new Date()); gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||""}',{anonymize_ip:true});
  }
  function showBanner(){var b=document.getElementById('gdpr-banner');if(b)b.style.display='block';}
  function hideBanner(){var b=document.getElementById('gdpr-banner');if(b)b.style.display='none';}
  document.addEventListener('DOMContentLoaded',function(){
    var a=document.getElementById('gdpr-accept');
    var e=document.getElementById('gdpr-essential');
    if(a)a.addEventListener('click',function(){localStorage.setItem(KEY,'all');hideBanner();loadGA();});
    if(e)e.addEventListener('click',function(){localStorage.setItem(KEY,'essential');hideBanner();});
    if(!c)showBanner(); else if(c==='all')loadGA();
  });
})();
        `}} />
      </body>
    </html>
  );
}
