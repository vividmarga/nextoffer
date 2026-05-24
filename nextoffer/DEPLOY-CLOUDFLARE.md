# 🚀 Deploy NextOffer pe Cloudflare Pages

## Metoda 1: GitHub → Cloudflare Pages (RECOMANDAT)

### Pasul 1: Pregătire locală
```bash
# Dezarhivează proiectul
unzip nextoffer-uk-platform.zip
cd nextoffer

# Instalează dependențele
npm install

# Testează build-ul local
npm run build
```

### Pasul 2: Urcă pe GitHub
```bash
git init
git add .
git commit -m "feat: initial NextOffer UK platform"

# Creează repo pe github.com (fără README)
git remote add origin https://github.com/USERNAME/nextoffer.git
git push -u origin main
```

### Pasul 3: Conectează la Cloudflare Pages
1. Mergi la **dash.cloudflare.com**
2. **Workers & Pages** → **Create application** → **Pages**
3. **Connect to Git** → Selectează repo-ul `nextoffer`
4. Setează build settings:

| Setting | Valoare |
|---------|---------|
| Framework preset | `Next.js` |
| Build command | `npx @cloudflare/next-on-pages` |
| Build output directory | `.vercel/output/static` |
| Node.js version | `20` |

5. Click **Save and Deploy** ✅

---

## Metoda 2: Deploy Direct (fără GitHub)

### Pasul 1: Instalează Wrangler
```bash
npm install -g wrangler
wrangler login    # deschide browser → autentifică-te cu contul CF
```

### Pasul 2: Build + Deploy
```bash
cd nextoffer
npm install
npm run build:cf   # = npx @cloudflare/next-on-pages

# Deploy la Cloudflare Pages
wrangler pages deploy .vercel/output/static \
  --project-name=nextoffer \
  --branch=main
```

Prima dată te va întreba să creezi proiectul — confirmă cu `y`.

---

## Environment Variables (OBLIGATORIU)

Setează în **Cloudflare Dashboard → Pages → nextoffer → Settings → Environment Variables**:

### Production
```
NEXT_PUBLIC_SITE_URL          = https://nextoffer.co.uk
NEXT_PUBLIC_SUPABASE_URL      = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY     = eyJ...
AWIN_PUBLISHER_ID             = 123456
IMPACT_PUBLISHER_ID           = your_id
SHAREASALE_AFFILIATE_ID       = your_id
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX
CF_PAGES                      = 1
```

Sau via CLI (mai sigur pentru keys secrete):
```bash
wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name=nextoffer
wrangler pages secret put AWIN_PUBLISHER_ID --project-name=nextoffer
# etc.
```

---

## Custom Domain

1. **Cloudflare Dashboard → Pages → nextoffer → Custom Domains**
2. Click **Set up a custom domain**
3. Introdu: `nextoffer.co.uk`
4. Dacă domeniul e deja în Cloudflare (recomandat!):
   - Se adaugă automat CNAME record
   - SSL gratuit inclus ✅
5. Dacă nu e în Cloudflare:
   - Adaugă CNAME la registrar: `nextoffer.co.uk → nextoffer.pages.dev`

---

## Cloudflare Pages Free Tier — Limite

| Feature | Free | Pro |
|---------|------|-----|
| Requests | 100k/zi | Unlimited |
| Bandwidth | Unlimited ✅ | Unlimited |
| Builds/lună | 500 | Unlimited |
| Custom domains | Unlimited ✅ | Unlimited |
| SSL | Inclus ✅ | Inclus |
| Edge locations | 300+ ✅ | 300+ |

**Suficient pentru lansare.** La trafic mare → upgrade la Pro ($25/mo).

---

## Structura de fișiere necesară după build

```
.vercel/
  output/
    static/           ← ce deploy-ezi pe CF Pages
      _worker.js      ← Worker-ul principal
      _routes.json    ← routing rules
      assets/         ← CSS, JS, imagini
      _next/          ← Next.js chunks
```

---

## Verificare deployment

```bash
# Test local înainte de deploy
npm run preview:cf

# Check logs după deploy
wrangler pages deployment tail --project-name=nextoffer

# Forțează rebuild
wrangler pages deployment create .vercel/output/static \
  --project-name=nextoffer
```

---

## Troubleshooting frecvent

### ❌ Error: `nodejs_compat` compatibility flag
```toml
# În wrangler.toml asigură-te că există:
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2024-09-23"
```

### ❌ Error: API routes nu funcționează
Toate API routes trebuie să aibă:
```typescript
export const runtime = "edge";
```

### ❌ Error: Image optimization failed
În `next.config.ts` asigură-te că:
```typescript
images: { unoptimized: true }
// sau folosește Cloudflare Images add-on
```

### ❌ Build prea lent
Generatorul de pagini programmatice (`generateStaticParams`) 
generează 300+ pagini. Normal să dureze 3-5 minute.

---

## Post-Deploy Checklist

- [ ] Site accesibil la `nextoffer.pages.dev`
- [ ] Custom domain configurat (`nextoffer.co.uk`)
- [ ] SSL activ (verde în browser)
- [ ] Environment variables setate în CF Dashboard
- [ ] Supabase DB pornit și migrat
- [ ] Google Search Console → Add property → nextoffer.co.uk
- [ ] Bing Webmaster Tools → Add site
- [ ] Submit sitemap: `nextoffer.co.uk/sitemap.xml`
- [ ] Test affiliate redirect: `nextoffer.co.uk/go/bt?deal=test`
- [ ] Lighthouse score > 90 (CF edge = foarte rapid)

---

*Generat de Claude | NextOffer UK Platform v0.1.0*
