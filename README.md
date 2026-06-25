# 🗾 ViTrox Company Incentive Trip 2026

Interactive trip visualiser for the **ViTrox 2026 Japan Incentive Trip** — 8 days across Tohoku, Fukushima, Nikkō, and Tokyo (Shibuya), covering ~1,200 employees across 32 batches.

🔗 **Live site:** [moybei.github.io/vitrox-company-trip-2026](https://moybei.github.io/vitrox-company-trip-2026)

---

## ✨ Features

- **Interactive Leaflet map** with full-route overview and per-day detail mode
- **Clickable day cards** — tap any day to zoom the map to that day's route
- **Hotel night markers** (numbered 1–7) at each night's accommodation
- **Attraction markers** (⭐) for every sightseeing stop
- **Route polylines** colour-coded by mode: 🔵 Shinkansen · 🟠 Bus
- **Hover tooltips** on route lines showing segment name + travel time
- **Rainbow day badge** colours themed by day type (nature, culture, shrine…)
- **Sky-blue** responsive UI — works on desktop and mobile

---

## 🗺 8-Day Itinerary

| Day | Route | Key Attractions |
|-----|-------|-----------------|
| 1 | Penang → Narita | — (travel day) |
| 2 | Narita → Sendai → Matsushima | Matsushima Bay · Godaido Temple |
| 3 | Naruko Onsen → Ginzan Onsen → Zao | Ginzan Onsen Street · Zao Fox Village |
| 4 | Zao → Goshikinuma Ponds → Tsuruga Castle → Ouchi-juku | Goshikinuma · Tsuruga Castle · Ouchi-juku |
| 5 | Ouchi-juku → Nikkō | Edo Wonderland · Nikkō Tōshō-gū · Kegon Falls |
| 6 | Oku-Nikkō → Hitachi Seaside Park → Shibuya | Hitachi Nemophila · Shisui Outlets |
| 7 | Shibuya → Kawagoe → Tsukiji → Shibuya Sky | Kawagoe Old Town · Tsukiji Market |
| 8 | Shibuya → Narita → Penang | — (travel day) |

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev) | UI components |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | Interactive map |
| [CartoDB Voyager](https://carto.com/basemaps/) | Map tiles |

---

## 🚀 Local Development

```bash
npm install
npm run dev        # http://localhost:5173
```

## 📦 Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

---

## 🌐 GitHub Pages Deployment

The site is deployed from the `dist/` folder via the `gh-pages` branch.  
See [Publishing to GitHub Pages](#) below for step-by-step instructions.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── TripMap.jsx      # Leaflet map with overview + day-detail modes
│   └── DayCard.jsx      # Accordion day cards with rainbow badge colours
├── data/
│   └── itinerary.js     # All 8-day GPS data, routes, hotels, attractions
├── App.jsx              # Root layout
└── App.css              # Global styles & Leaflet marker overrides
```

---

## 📝 Documentation

- [`Company Trip.md`](Company%20Trip.md) — full itinerary, flight details, hotel list, GPS coordinates
- [`project-plan.md`](project-plan.md) — development plan and coordinate reference

---

*Built with ❤️ for the ViTrox 2026 Japan Incentive Trip.*

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
