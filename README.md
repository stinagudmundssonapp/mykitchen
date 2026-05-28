# 🧊 MyKitchen

Smart kjøkkenassistent som hjelper deg holde orden på kjøleskapet, planlegge
middager med AI, og handle smartere. Bygget som en webapp med Next.js, og
designet for å føles som en ekte app.

> **Status:** Prototype under aktiv utvikling. Designet er ferdig, AI er koblet
> på flere flyter, andre er fortsatt mockede. Se _Statustabell_ nederst.

---

## ✨ Hovedfunksjoner

1. **🧊 Kjøleskap** — Lukket kjøleskap som svinger åpen på klikk (signaturanimasjon
   med Framer Motion). Tre hyller (Øverste, Midthylle, Grønnsakskuff), legg til
   varer via bottom-sheet, varer som snart går ut markeres diskret.
2. **📸 Scan kvittering** — Plassholder for OCR (Claude Vision kobles på neste);
   simulerer prosessering og lar deg godkjenne gjenkjente varer.
3. **⚙️ Preferanser** — Allergier, diett, misliker, husholdningsstørrelse,
   budsjettnivå. Brukes av AI ved oppskriftsforslag.
4. **👨‍🍳 Oppskrifter** — To moduser, begge live mot Claude:
   - _"Lag av det jeg har"_ — basert på inventaret
   - _"Jeg har lyst på..."_ — basert på fritekst + inventaret
   - Prioriterer varer som snart går ut, viser tid og prisestimat for manglende
     varer, kan ekspanderes til full fremgangsmåte.
5. **📖 Lagrede oppskrifter** — Import via URL fra matprat.no / godt.no (parser
   kommer), eller lagre AI-genererte forslag.
6. **🛒 Handleliste med kart** — Mapbox-kart med butikker rundt deg, tre
   sorteringsmoduser (billigst / nærmest / vanlig), automatisk anbefaling
   fremhevet med pulsering på kartet.

---

## 🎨 Design-filosofi

- **Premium & rolig** — Linear / Notion / Cal.com som referanse
- **Dempet sage-grønn palett** — _ingen oransje, ingen neon_
- **Generøs whitespace** — ingenting cluttered
- **Avrundede hjørner, myke skygger** — ingen harde linjer
- **Smooth animasjoner** — Framer Motion (`layoutId`, `AnimatePresence`)
- **Sans-serif** — Geist Sans (Vercel sin grotesk-font)
- **Skeleton screens** — ikke spinnere

Se `globals.css` for hele design-systemet (sage palette, radii, shadows).

---

## 🛠 Teknisk stack

| Lag | Verktøy |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Språk | TypeScript |
| Styling | Tailwind CSS v4 (CSS-først config) |
| Animasjoner | Framer Motion |
| AI | Anthropic Claude Opus 4.7 (structured outputs) |
| Kart | Mapbox GL + react-map-gl |
| Lagring | localStorage (Supabase kobles på i fase 4) |
| Hosting | Vercel |

---

## 🚀 Kjøre lokalt

```bash
git clone git@github.com:stinagudmundssonapp/mykitchen.git
cd mykitchen
npm install
```

Opprett `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_MAPBOX_TOKEN=pk....
```

Start:

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Mappestruktur

```
src/
├── app/
│   ├── layout.tsx              ← Root: html/body + RefrigeratorProvider + AppShell
│   ├── template.tsx            ← Side-overganger (fade + slide, 200ms)
│   ├── page.tsx                ← Forsiden (/) med kjøleskapet
│   ├── globals.css             ← Design tokens (sage palette) + Tailwind
│   ├── scan/page.tsx           ← /scan
│   ├── preferanser/page.tsx    ← /preferanser
│   ├── oppskrifter/page.tsx    ← /oppskrifter (live AI)
│   ├── lagret/page.tsx         ← /lagret
│   ├── handleliste/page.tsx    ← /handleliste (live kart)
│   └── api/
│       └── recipes/route.ts    ← Claude API endpoint
├── components/
│   ├── AppShell.tsx            ← Sidebar (desktop) + bunntabs (mobil)
│   ├── Fridge.tsx              ← Signaturmoment: lukket → åpen
│   ├── StoreMap.tsx            ← Mapbox-kart med butikk-pins
│   ├── PageHeader.tsx          ← Eyebrow + tittel + beskrivelse
│   └── HomeActions.tsx         ← Snarvei-kort på forsiden
└── context/
    └── RefrigeratorContext.tsx ← localStorage + state for varer
```

---

## 📋 Statustabell

| Side | UI | Logikk | Data |
|---|---|---|---|
| `/` Kjøleskap | ✅ Polert | ✅ localStorage | ✅ Brukerdata |
| `/scan` | ✅ Ferdig | 🟡 2s fake-OCR | ⏳ Claude Vision neste |
| `/preferanser` | ✅ Ferdig | 🟡 Lagring ikke koblet | ⏳ localStorage neste |
| `/oppskrifter` | ✅ Polert | ✅ Live API | ✅ Claude Opus 4.7 |
| `/lagret` | ✅ Ferdig | 🟡 URL-parser mangler | ⏳ Scraping kommer |
| `/handleliste` | ✅ Polert | ✅ Live kart + geolocation | 🟡 Tilbud mocket (Kassal.app kommer) |

---

## 🗺️ Roadmap (kort)

1. ✅ Design-system, kjøleskaps-animasjon, 6 sider, navigasjon
2. ✅ Claude AI på `/oppskrifter`
3. ✅ Mapbox med ekte butikker på `/handleliste`
4. ⏳ Claude Vision på `/scan` (kvittering → varer)
5. ⏳ Alle norske butikker fra OSM Overpass
6. ⏳ Kassal.app for ekte tilbudsdata
7. ⏳ URL-import-parser for matprat.no / godt.no
8. ⏳ Supabase: auth + sync på tvers av enheter
9. ⏳ Lagre preferanser & handleliste

---

Bygget av [@stinagudmundssonapp](https://github.com/stinagudmundssonapp) ·
designet for studenter som vil spise smartere.
