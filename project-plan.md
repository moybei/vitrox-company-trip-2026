# ViTrox Japan Incentive Trip 2026 – Project Documentation

## What Was Built

A **Vite + React** interactive trip visualizer for the 2026 ViTrox Company Japan Incentive Trip.
Accessible at **http://localhost:5173/** (dev) or deployed as a static build.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Vite 8 + React 18 | `npm run dev` / `npm run build` |
| Map | Leaflet 1.9 + react-leaflet | CartoDB Voyager tiles — no API key needed |
| Styling | Plain CSS (App.css) | CSS custom properties, no CSS-in-JS |
| Data | Static JS modules | `src/data/itinerary.js`, `trips.js`, `flights.js` |
| Icons | SVG emoji favicon | `public/favicon.svg` — 🗾 Japan map emoji |

---

## Project Structure

```
d:\negi\vitrox-company-trip\
├── index.html                  ← "ViTrox Japan Incentive Trip 2026" title
├── public/
│   └── favicon.svg             ← 🗾 emoji favicon
├── src/
│   ├── main.jsx
│   ├── App.jsx                 ← root layout, trip selector, flight toggle
│   ├── App.css                 ← all styles (baby blue / sky blue theme)
│   ├── components/
│   │   ├── DayCard.jsx         ← accordion day cards with rainbow type colours
│   │   ├── TripMap.jsx         ← Leaflet map, markers, polylines
│   │   └── FlightInfo.jsx      ← collapsible flight schedule panel
│   └── data/
│       ├── itinerary.js        ← 8-day itinerary with verified GPS coordinates
│       ├── trips.js            ← 32 trip batch dates
│       └── flights.js          ← Cathay Pacific & Singapore Airlines schedules
└── Company Trip.md             ← source of truth for trip content
```

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🗾  ViTrox Japan Incentive Trip 2026    ← sky-blue gradient hdr │
│       8D7N · Japan Tohoku · 32 Batches                          │
├──────────┬──────────────────┬───────────────────────────────────┤
│ Trip 1 ▾ │ 15 Aug → 22 Aug │  Cathay Pacific 23 kg ▼           │
├──────────┴──────────────────┴───────────────────────────────────┤  ← sticky
│  [Collapsible flight schedule panel]                            │
├────────────────────────────┬────────────────────────────────────┤
│  🗺 Route Map              │  Day-by-Day Itinerary              │
│  (Leaflet, CartoDB tiles)  │                                    │
│                            │  [1] ✈️ Departure – Penang …      │
│  Click day number or card  │  [2] ⛩️ Narita → Sendai, Miyagi   │
│  → zooms map to that day   │  [3] ♨️ Miyagi → Ginzan → Zao     │
│  ← Full Route button       │  [4] 🏯 Zao → Goshikinuma…        │
│                            │  [5] ⛩️ Fukushima → Nikkō         │
│  Legend: shinkansen / bus  │  [6] 🌸 Nikkō → Ibaraki → Shibuya │
│          hotel / attraction│  [7] 🗼 Shibuya, Tokyo            │
│                            │  [8] ✈️ Return – Japan to Penang  │
└────────────────────────────┴────────────────────────────────────┘
```

---

## Features

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Trip batch selector** | Dropdown for Trip 1–32; changes all displayed dates |
| 2 | **Date range display** | Computed start/end date shown in controls bar |
| 3 | **Leaflet interactive map** | CartoDB Voyager tiles, zoom/pan, day markers |
| 4 | **Map overview** | All 8 days' routes + stop markers + hotel pins |
| 5 | **Map day-detail** | Click a card → map zooms to that day's route, stops, attractions |
| 6 | **Accordion day cards** | Click to expand — shows travel segments, attraction pills, hotel link |
| 7 | **Rainbow day badges** | Each day type has a distinct colour (7 types); badge pops when selected |
| 8 | **Travel segments** | ✈️ Flight / 🚅 Shinkansen / 🚌 Bus with estimated duration |
| 9 | **Attraction pills** | Tappable → opens verified Google Maps short link |
| 10 | **Hotel row** | Night number, hotel name with ♨️ onsen flag, opens Google Maps |
| 11 | **Per-trip airline** | Cathay Pacific (11 trips) vs Singapore Airlines (21 trips) |
| 12 | **Flight info panel** | Toggle shows full outbound/inbound schedule with ETD/ETA/duration |
| 13 | **Mobile responsive** | Stacked layout below 768 px; map auto-scrolls into view on day select |
| 14 | **Baby blue theme** | Sky-blue gradient header, `#f0f9ff` background, coloured card borders |

---

## Design System

| Token | Value | Used for |
|-------|-------|---------|
| Header | `linear-gradient(135deg, #0369a1, #0ea5e9, #38bdf8)` | Top header bar |
| Page bg | `#f0f9ff` | Body background |
| Controls border | `#bae6fd` | Bottom border of sticky controls bar |
| Date badge | `bg #e0f2fe, color #0369a1` | Trip date range pill |
| Card border | `#e0f2fe` | Default day card border |
| Card left accent | `var(--dc-accent)` | Per-type colour on hover/select |
| Badge bg | `var(--dc-bg)` | Coloured circle for day number |

### Day Type Colours

| Type | Days | Accent | Background |
|------|------|--------|------------|
| travel | 1, 8 | `#2563eb` (blue) | `#dbeafe` |
| explore | 2 | `#0891b2` (teal) | `#cffafe` |
| nature | 3 | `#7c3aed` (purple) | `#ede9fe` |
| culture | 4 | `#d97706` (amber) | `#fef3c7` |
| shrine | 5 | `#e11d48` (rose) | `#ffe4e6` |
| park | 6 | `#059669` (emerald) | `#d1fae5` |
| city | 7 | `#c026d3` (fuchsia) | `#fae8ff` |

---

## 8-Day Itinerary (as built)

| Day | Title | Segments | Attractions | Hotel (Night) |
|-----|-------|----------|-------------|---------------|
| 1 | Departure – Penang to Japan | ✈️ PEN → NRT/HND | — | Narita Tobu Hotel Airport |
| 2 | Narita → Sendai, Miyagi | 🚅 Narita→Sendai (~1h 30m) · 🚌 Sendai→Matsushima (~50 min) | Sendai Fish Market · Matsushima Island · Matsushima Bay · Godaido of Zuiganji Temple | Hotel Kameya ♨️ (Naruko Onsen) |
| 3 | Miyagi → Ginzan Onsen → Zao | 🚌 Naruko Onsen→Ginzan Onsen (~2h 20m) · 🚌 Ginzan Onsen→Zao (~1h 30m) | Ginzan Onsen Street · Zao Fox Village | Miyagi Zao Resort & Spa ♨️ |
| 4 | Zao → Goshikinuma Ponds → Fukushima | 🚌 Zao→Goshikinuma (~2h 30m) · 🚌 Goshikinuma→Tsuruga Castle (~30 min) · 🚌 Aizu→Ouchi-juku (~50 min) | Goshikinuma Ponds · Tsuruga Castle · Ouchi-juku | Onyado Toho Hotel ♨️ (Higashiyama Onsen) |
| 5 | Fukushima → Nikkō, Tochigi | 🚌 Ouchi-juku→Nikkō (~3h) | Edo Wonderland · Nikkō Tōshō-gū · Kegon Falls | Oku Nikko Hotel Shikisai ♨️ |
| 6 | Nikkō → Ibaraki → Shibuya, Kantō | 🚌 Oku-Nikkō→Hitachi (~2h 30m) · 🚌 Hitachi→Shisui (~1h 30m) · 🚌 Shisui→Shibuya (~1h) | Hitachi Seaside Park · Shisui Premium Outlets | Shibuya Granbell Hotel |
| 7 | Shibuya, Tokyo | 🚌 Shibuya→Kawagoe (~1h) · 🚌 Kawagoe→Tsukiji (~1h 30m) · 🚌 Tsukiji→Shibuya Sky (~30 min) | Kawagoe Old Town · Tsukiji Outer Market · Shibuya Crossing · Shibuya Sky | Shibuya Granbell Hotel |
| 8 | Return – Japan to Penang | 🚌 Shibuya→Narita (~1h 20m) · ✈️ NRT/HND→PEN | — | — |

---

## Hotels (verified Google Maps coordinates)

| Night | Hotel | Location | Lat, Lng | Google Maps |
|-------|-------|----------|----------|-------------|
| 1 | Narita Tobu Hotel Airport | Narita, Chiba | 35.7800, 140.3809 | https://maps.app.goo.gl/Roxm2eXcGuuwa8SF6 |
| 2 | Hotel Kameya ♨️ | Naruko Onsen, Miyagi | 38.7479, 140.7266 | https://maps.app.goo.gl/MmqXh8W1rTyfZWtaA |
| 3 | Miyagi Zao Resort & Spa ♨️ | Shichikashuku, Miyagi | 38.1319, 140.5607 | https://maps.app.goo.gl/53tTJwwjXFtypuMg7 |
| 4 | Onyado Toho Hotel ♨️ | Higashiyama Onsen, Aizuwakamatsu | 37.4822, 139.9587 | https://maps.app.goo.gl/WoWQdYC83fhgoMTD9 |
| 5 | Oku Nikko Hotel Shikisai ♨️ | Lake Chuzenji, Oku-Nikkō | 36.7476, 139.4713 | https://maps.app.goo.gl/8xaoyjjhCFkiyzUy7 |
| 6–7 | Shibuya Granbell Hotel | Shibuya, Tokyo | 35.6563, 139.7016 | https://maps.app.goo.gl/xTjvfYPWDuym3WEq5 |

---

## Map Locations (verified GPS coordinates)

All coordinates verified via Google Maps short links. Key map points:

| Location | Lat, Lng | Notes |
|----------|----------|-------|
| Narita Airport (NRT) | 35.7731, 140.3897 | Airport marker |
| Sendai | 38.2690, 140.8694 | Shinkansen terminus |
| Sendai Fish Market | 38.2588, 140.8787 | Attraction |
| Matsushima Bay | 38.3309, 141.0955 | Attraction |
| Godaido of Zuiganji | 38.3697, 141.0642 | Attraction |
| Naruko Onsen | 38.7479, 140.7266 | Hotel Kameya / Day 3 start |
| Ginzan Onsen | 38.5699, 140.5308 | Attraction |
| Zao Fox Village | 38.0408, 140.5304 | Attraction |
| Zao / Shichikashuku | 38.1319, 140.5607 | Miyagi Zao Resort |
| Goshikinuma Ponds | 37.6509, 140.0732 | Attraction (near Inawashiro) |
| Tsuruga Castle | 37.4878, 139.9297 | Attraction |
| Ouchi-juku | 37.3342, 139.8607 | Attraction / Day 5 start |
| Edo Wonderland | 36.7908, 139.6973 | Attraction |
| Nikkō Tōshō-gū | 36.7581, 139.5987 | Attraction |
| Kegon Falls | 36.7381, 139.5019 | Attraction |
| Oku-Nikkō Hotel | 36.7476, 139.4713 | Hotel / Day 6 start |
| Hitachi Seaside Park | 36.4059, 140.5965 | Attraction |
| Shisui Outlets | 35.7138, 140.2941 | Attraction |
| Kawagoe | 35.9235, 139.4829 | Attraction |
| Tsukiji Market | 35.6648, 139.7703 | Attraction |
| Shibuya Sky | 35.6587, 139.7020 | Attraction |
| Shibuya / Granbell Hotel | 35.6563, 139.7016 | Hotel |

---

## Trip Batches

32 batches from **15 Aug 2026** to **28 Nov 2026**. All share the same 8-day itinerary.

**Cathay Pacific** (23 kg baggage): Trips 1, 2, 3, 4, 8, 9, 10, 18, 22, 30, 32  
**Singapore Airlines** (25 kg baggage): Trips 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 31

---

## Running the Project

```powershell
cd d:\negi\vitrox-company-trip
npm run dev      # dev server → http://localhost:5173/
npm run build    # production build → dist/
```
