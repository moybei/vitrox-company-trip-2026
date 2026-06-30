// Travel mode constants
export const MODE = {
  FLIGHT:     'flight',
  SHINKANSEN: 'shinkansen',
  BUS:        'bus',
};

// Polyline style per mode
export const MODE_STYLE = {
  flight:     { color: '#dc2626', weight: 2, dashArray: '8 6', opacity: 0.7 },
  shinkansen: { color: '#2563eb', weight: 4, dashArray: null,  opacity: 0.85 },
  bus:        { color: '#d97706', weight: 3, dashArray: '5 5', opacity: 0.8 },
};

export const MODE_LABEL = {
  flight:     { icon: '✈️', label: 'Flight',      bg: '#fff0f0', text: '#c0392b' },
  shinkansen: { icon: '🚅', label: 'Shinkansen',  bg: '#eef3ff', text: '#2554d1' },
  bus:        { icon: '🚌', label: 'Tour Bus',     bg: '#fff8eb', text: '#d97706' },
};

// Fallback coordinate-based link for stops without a specific short link
const gm = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

export const ITINERARY = [
  // ── DAY 1 ────────────────────────────────────────────────────
  //
  // NOTE: Day 1's arrival airport differs per airline (Cathay → NRT, SQ → HND).
  // The base shape below is overwritten by `getItineraryForAirline()`.
  // Treat this as the default fallback.
  {
    day: 1,
    type: 'travel',
    icon: '✈️',
    title: 'Departure – Penang to Japan',
    segments: [
      { from: 'Penang (PEN)', to: 'Narita (NRT)', mode: MODE.FLIGHT, duration: 'See flight details' },
      { from: 'Narita (NRT)', to: 'Narita Tobu Hotel Airport', mode: MODE.BUS, duration: '~10 min' },
    ],
    attractions: [],
    hotel: {
      // Narita Tobu Hotel Airport — verified: 35.7800, 140.3809
      name: 'Narita Tobu Hotel Airport',
      lat: 35.7800, lng: 140.3809,
      googleUrl: 'https://maps.app.goo.gl/Roxm2eXcGuuwa8SF6',
      night: 1,
    },
    mapPoints: [
      { lat: 35.7731, lng: 140.3897, label: 'Narita (NRT)', type: 'airport', googleUrl: 'https://maps.app.goo.gl/gS1fi8WJWuCPEDoq5' },
    ],
    polylines: [
      { points: [[35.7731, 140.3897], [35.7800, 140.3809]], mode: MODE.BUS },
    ],
  },

  // ── DAY 2 ────────────────────────────────────────────────────
  {
    day: 2,
    type: 'explore',
    icon: '⛩️',
    title: 'Narita → Sendai, Miyagi',
    segments: [
      { from: 'Narita',     to: 'Sendai',       mode: MODE.SHINKANSEN, duration: '~1h 30m' },
      { from: 'Sendai',     to: 'Matsushima',   mode: MODE.BUS,         duration: '~40 min' },
      { from: 'Matsushima', to: 'Naruko Onsen', mode: MODE.BUS,         duration: '~1h 30m' },
    ],
    attractions: [
      { name: 'Sendai Fish Market',        googleUrl: 'https://maps.app.goo.gl/EiXTzvmFMEjxjp2W9' },
      { name: 'Matsushima Island (Fukuurajima)', googleUrl: gm(38.3734, 141.0789) },
      { name: 'Matsushima Bay',             googleUrl: 'https://maps.app.goo.gl/LiLoAVP1b4ucf7HRA' },
      { name: 'Godaido of Zuiganji Temple', googleUrl: 'https://maps.app.goo.gl/J7BsdXePjMw1vA7v7' },
    ],
    hotel: {
      // Hotel Kameya — verified at Naruko Onsen, Miyagi: 38.7479, 140.7266
      // (Google Maps link MmqXh8W1rTyfZWtaA → Hotel Kameya @38.7479,140.7266)
      name: 'Hotel Kameya ♨️',
      lat: 38.7479, lng: 140.7266,
      googleUrl: 'https://maps.app.goo.gl/MmqXh8W1rTyfZWtaA',
      night: 2,
    },
    mapPoints: [
      { lat: 35.7731, lng: 140.3897, label: 'Narita',               type: 'stop',       googleUrl: 'https://maps.app.goo.gl/gS1fi8WJWuCPEDoq5' },
      { lat: 38.2690, lng: 140.8694, label: 'Sendai',               type: 'stop' },
      { lat: 38.2588, lng: 140.8787, label: 'Sendai Fish Market',   type: 'attraction', googleUrl: 'https://maps.app.goo.gl/EiXTzvmFMEjxjp2W9' },
      { lat: 38.3734, lng: 141.0789, label: 'Matsushima Island',    type: 'attraction', googleUrl: gm(38.3734, 141.0789) },
      { lat: 38.3671, lng: 141.0645, label: 'Matsushima Bay',       type: 'attraction', googleUrl: 'https://maps.app.goo.gl/LiLoAVP1b4ucf7HRA' },
      { lat: 38.3697, lng: 141.0642, label: 'Godaido of Zuiganji',  type: 'attraction', googleUrl: 'https://maps.app.goo.gl/J7BsdXePjMw1vA7v7' },
    ],
    polylines: [
      { points: [[35.7800, 140.3809], [38.2690, 140.8694]], mode: MODE.SHINKANSEN },
      { points: [[38.2690, 140.8694], [38.3671, 141.0645]], mode: MODE.BUS },
      { points: [[38.3671, 141.0645], [38.7479, 140.7266]], mode: MODE.BUS },
    ],
  },

  // ── DAY 3 ────────────────────────────────────────────────────
  {
    day: 3,
    type: 'nature',
    icon: '♨️',
    title: 'Miyagi → Ginzan Onsen → Zao',
    segments: [
      { from: 'Naruko Onsen / Miyagi', to: 'Ginzan Onsen', mode: MODE.BUS, duration: '~2h' },
      { from: 'Ginzan Onsen',          to: 'Zao',          mode: MODE.BUS, duration: '~1h 30m' },
    ],
    attractions: [
      { name: 'Ginzan Onsen Street', googleUrl: 'https://maps.app.goo.gl/gv1wqR7d11W5HfNf8' },
      { name: 'Zao Fox Village',     googleUrl: 'https://maps.app.goo.gl/Wh1VPtx4MHg5Usws6' },
    ],
    hotel: {
      // Mercure Miyagi Zao Resort & Spa — verified: 38.1319, 140.5607
      name: 'Miyagi Zao Resort & Spa ♨️',
      lat: 38.1319, lng: 140.5607,
      googleUrl: 'https://maps.app.goo.gl/53tTJwwjXFtypuMg7',
      night: 3,
    },
    mapPoints: [
      { lat: 38.7479, lng: 140.7266, label: 'Naruko Onsen / Miyagi', type: 'stop' },
      { lat: 38.5699, lng: 140.5308, label: 'Ginzan Onsen',          type: 'attraction', googleUrl: 'https://maps.app.goo.gl/gv1wqR7d11W5HfNf8' },
      { lat: 38.0408, lng: 140.5304, label: 'Zao Fox Village',       type: 'attraction', googleUrl: 'https://maps.app.goo.gl/Wh1VPtx4MHg5Usws6' },
      { lat: 38.1319, lng: 140.5607, label: 'Zao / Shichikashuku',   type: 'stop' },
    ],
    polylines: [
      { points: [[38.7479, 140.7266], [38.5699, 140.5308]], mode: MODE.BUS },
      { points: [[38.5699, 140.5308], [38.1319, 140.5607]], mode: MODE.BUS },
    ],
  },

  // ── DAY 4 ────────────────────────────────────────────────────
  {
    day: 4,
    type: 'culture',
    icon: '🏯',
    title: 'Zao → Goshikinuma Ponds → Fukushima',
    segments: [
      { from: 'Zao',          to: 'Goshikinuma Ponds',     mode: MODE.BUS, duration: '~2h' },
      { from: 'Goshikinuma', to: 'Tsuruga Castle (Aizu)',  mode: MODE.BUS, duration: '~30 min' },
      { from: 'Aizu',        to: 'Ouchi-juku',              mode: MODE.BUS, duration: '~50 min' },
      { from: 'Ouchi-juku',  to: 'Higashiyama Onsen',      mode: MODE.BUS, duration: '~40 min' },
    ],
    attractions: [
      { name: 'Goshikinuma Ponds', googleUrl: 'https://maps.app.goo.gl/Yd1RaoqBVijSbt9r9' },
      { name: 'Tsuruga Castle',    googleUrl: 'https://maps.app.goo.gl/s5gUNy4ZyAiLTPpC8' },
      { name: 'Ouchi-juku',        googleUrl: 'https://maps.app.goo.gl/6eAeK9z6ibU7uMe78' },
    ],
    hotel: {
      // Onyado Toho Hotel — verified at Higashiyama Onsen, Aizuwakamatsu: 37.4822, 139.9587
      // (Google Maps link WoWQdYC83fhgoMTD9 → Onyado Toho @37.4822,139.9587)
      name: 'Onyado Toho Hotel ♨️',
      lat: 37.4822, lng: 139.9587,
      googleUrl: 'https://maps.app.goo.gl/WoWQdYC83fhgoMTD9',
      night: 4,
    },
    mapPoints: [
      { lat: 38.1319, lng: 140.5607, label: 'Zao / Shichikashuku', type: 'stop' },
      { lat: 37.6509, lng: 140.0732, label: 'Goshikinuma Ponds',   type: 'attraction', googleUrl: 'https://maps.app.goo.gl/Yd1RaoqBVijSbt9r9' },
      { lat: 37.4878, lng: 139.9297, label: 'Tsuruga Castle',      type: 'attraction', googleUrl: 'https://maps.app.goo.gl/s5gUNy4ZyAiLTPpC8' },
      { lat: 37.3342, lng: 139.8607, label: 'Ouchi-juku',          type: 'attraction', googleUrl: 'https://maps.app.goo.gl/6eAeK9z6ibU7uMe78' },
    ],
    polylines: [
      { points: [[38.1319, 140.5607], [37.6509, 140.0732]], mode: MODE.BUS },
      { points: [[37.6509, 140.0732], [37.4878, 139.9297]], mode: MODE.BUS },
      { points: [[37.4878, 139.9297], [37.3342, 139.8607]], mode: MODE.BUS },
      { points: [[37.3342, 139.8607], [37.4822, 139.9587]], mode: MODE.BUS },
    ],
  },

  // ── DAY 5 ────────────────────────────────────────────────────
  {
    day: 5,
    type: 'shrine',
    icon: '⛩️',
    title: 'Fukushima → Nikkō, Tochigi',
    segments: [
      { from: 'Aizuwakamatsu', to: 'Nikkō', mode: MODE.BUS, duration: '~3h' },
    ],
    attractions: [
      { name: 'Edo Wonderland',  googleUrl: 'https://maps.app.goo.gl/iie9meEFEazCpceA8' },
      { name: 'Nikkō Tōshō-gū', googleUrl: 'https://maps.app.goo.gl/vZZgbYsyjL2CFMVS9' },
      { name: 'Kegon Falls',     googleUrl: 'https://maps.app.goo.gl/zKJq5WvhNPtf2VgR7' },
    ],
    hotel: {
      // Oku Nikko Hotel Shikisai — verified: 36.7476, 139.4713 (Lake Chuzenji / Oku-Nikko)
      name: 'Oku Nikko Hotel Shikisai ♨️',
      lat: 36.7476, lng: 139.4713,
      googleUrl: 'https://maps.app.goo.gl/8xaoyjjhCFkiyzUy7',
      night: 5,
    },
    mapPoints: [
      { lat: 37.4822, lng: 139.9587, label: 'Higashiyama Onsen', type: 'stop' },
      { lat: 36.7908, lng: 139.6973, label: 'Edo Wonderland', type: 'attraction', googleUrl: 'https://maps.app.goo.gl/iie9meEFEazCpceA8' },
      { lat: 36.7581, lng: 139.5987, label: 'Nikkō Tōshō-gū', type: 'attraction', googleUrl: 'https://maps.app.goo.gl/vZZgbYsyjL2CFMVS9' },
      { lat: 36.7381, lng: 139.5019, label: 'Kegon Falls',    type: 'attraction', googleUrl: 'https://maps.app.goo.gl/zKJq5WvhNPtf2VgR7' },
      { lat: 36.7476, lng: 139.4713, label: 'Oku-Nikkō',      type: 'stop' },
    ],
    polylines: [
      { points: [[37.4822, 139.9587], [36.7908, 139.6973]], mode: MODE.BUS },
      { points: [[36.7908, 139.6973], [36.7581, 139.5987]], mode: MODE.BUS },
      { points: [[36.7581, 139.5987], [36.7381, 139.5019]], mode: MODE.BUS },
      { points: [[36.7381, 139.5019], [36.7476, 139.4713]], mode: MODE.BUS },
    ],
  },

  // ── DAY 6 ────────────────────────────────────────────────────
  {
    day: 6,
    type: 'park',
    icon: '🌸',
    title: 'Nikkō → Ibaraki → Shibuya, Kantō',
    segments: [
      { from: 'Oku-Nikkō',           to: 'Hitachi Seaside Park',   mode: MODE.BUS, duration: '~3h' },
      { from: 'Hitachi Seaside Park', to: 'Shisui Premium Outlets', mode: MODE.BUS, duration: '~1h 45m' },
      { from: 'Shisui',              to: 'Shibuya',                 mode: MODE.BUS, duration: '~1h 30m' },
    ],
    attractions: [
      { name: 'Hitachi Seaside Park',   googleUrl: 'https://maps.app.goo.gl/wX3LPhh6uEXxf5E88' },
      { name: 'Shisui Premium Outlets', googleUrl: 'https://maps.app.goo.gl/3oX62zZ6p9tzWktv6' },
    ],
    hotel: {
      // Shibuya Granbell Hotel — verified: 35.6563, 139.7016
      name: 'Shibuya Granbell Hotel',
      lat: 35.6563, lng: 139.7016,
      googleUrl: 'https://maps.app.goo.gl/xTjvfYPWDuym3WEq5',
      night: 6,
    },
    mapPoints: [
      { lat: 36.7476, lng: 139.4713, label: 'Oku-Nikkō',           type: 'stop' },
      { lat: 36.4059, lng: 140.5965, label: 'Hitachi Seaside Park', type: 'attraction', googleUrl: 'https://maps.app.goo.gl/wX3LPhh6uEXxf5E88' },
      { lat: 35.7138, lng: 140.2941, label: 'Shisui Outlets',       type: 'attraction', googleUrl: 'https://maps.app.goo.gl/3oX62zZ6p9tzWktv6' },
      { lat: 35.6563, lng: 139.7016, label: 'Shibuya',              type: 'stop' },
    ],
    polylines: [
      { points: [[36.7476, 139.4713], [36.4059, 140.5965]], mode: MODE.BUS },
      { points: [[36.4059, 140.5965], [35.7138, 140.2941]], mode: MODE.BUS },
      { points: [[35.7138, 140.2941], [35.6563, 139.7016]], mode: MODE.BUS },
    ],
  },

  // ── DAY 7 ────────────────────────────────────────────────────
  {
    day: 7,
    type: 'city',
    icon: '🗼',
    title: 'Shibuya, Tokyo',
    segments: [
      { from: 'Shibuya', to: 'Kawagoe',     mode: MODE.BUS, duration: '~1h' },
      { from: 'Kawagoe', to: 'Tsukiji',     mode: MODE.BUS, duration: '~1h 30m' },
      { from: 'Tsukiji', to: 'Shibuya Sky', mode: MODE.BUS, duration: '~30 min' },
    ],
    attractions: [
      { name: 'Kawagoe Old Town',     googleUrl: 'https://maps.app.goo.gl/cBGfg5qUsQ63hMM38' },
      { name: 'Tsukiji Outer Market', googleUrl: 'https://maps.app.goo.gl/oKbRoSSrXohXgj9z8' },
      { name: 'Shibuya Crossing',     googleUrl: 'https://maps.app.goo.gl/erR2kFanBzgffitf6' },
      { name: 'Shibuya Sky',          googleUrl: 'https://maps.app.goo.gl/erR2kFanBzgffitf6' },
    ],
    hotel: {
      name: 'Shibuya Granbell Hotel',
      lat: 35.6563, lng: 139.7016,
      googleUrl: 'https://maps.app.goo.gl/xTjvfYPWDuym3WEq5',
      night: 7,
    },
    mapPoints: [
      { lat: 35.6563, lng: 139.7016, label: 'Shibuya',     type: 'stop' },
      { lat: 35.9235, lng: 139.4829, label: 'Kawagoe',     type: 'attraction', googleUrl: 'https://maps.app.goo.gl/cBGfg5qUsQ63hMM38' },
      { lat: 35.6648, lng: 139.7703, label: 'Tsukiji',     type: 'attraction', googleUrl: 'https://maps.app.goo.gl/oKbRoSSrXohXgj9z8' },
      { lat: 35.6587, lng: 139.7020, label: 'Shibuya Sky', type: 'attraction', googleUrl: 'https://maps.app.goo.gl/erR2kFanBzgffitf6' },
    ],
    polylines: [
      { points: [[35.6563, 139.7016], [35.9235, 139.4829]], mode: MODE.BUS },
      { points: [[35.9235, 139.4829], [35.6648, 139.7703]], mode: MODE.BUS },
      { points: [[35.6648, 139.7703], [35.6587, 139.7020]], mode: MODE.BUS },
    ],
  },

  // ── DAY 8 ────────────────────────────────────────────────────
  {
    day: 8,
    type: 'travel',
    icon: '✈️',
    title: 'Return – Japan to Penang',
    segments: [
      { from: 'Shibuya',      to: 'Narita (NRT)', mode: MODE.BUS,    duration: '~1h 20m' },
      { from: 'Narita (NRT)', to: 'Penang (PEN)', mode: MODE.FLIGHT, duration: 'See flight details' },
    ],
    attractions: [],
    hotel: null,
    mapPoints: [
      { lat: 35.6563, lng: 139.7016, label: 'Shibuya',      type: 'stop' },
      { lat: 35.7731, lng: 140.3897, label: 'Narita (NRT)', type: 'airport', googleUrl: 'https://maps.app.goo.gl/gS1fi8WJWuCPEDoq5' },
    ],
    polylines: [
      { points: [[35.6563, 139.7016], [35.7731, 140.3897]], mode: MODE.BUS },
    ],
  },
];

// ────────────────────────────────────────────────────────────────
// Airline-aware Day 1 overrides
//
// Cathay flights arrive at NRT (Narita) — short shuttle to the hotel
// SQ flights arrive at HND (Haneda) — long limousine bus ride to Narita-area hotel
// Day 8 is identical for both (everyone departs from NRT)
// ────────────────────────────────────────────────────────────────

// Coordinates reused below
const HOTEL_LL = [35.7800, 140.3809]; // Narita Tobu Hotel Airport
const NRT_LL   = [35.7731, 140.3897]; // Narita International
const HND_LL   = [35.5494, 139.7798]; // Haneda

const DAY1_BY_AIRLINE = {
  cathay: {
    airportLabel: 'Narita (NRT)',
    airportCoords: NRT_LL,
    airportUrl: 'https://maps.app.goo.gl/gS1fi8WJWuCPEDoq5',
    // NRT terminal to Narita Tobu Hotel Airport — free hotel shuttle, ~10 min
    busDuration: '~10 min',
  },
  sq: {
    airportLabel: 'Haneda (HND)',
    airportCoords: HND_LL,
    airportUrl: gm(HND_LL[0], HND_LL[1]),
    // HND → Narita-area hotel via Wangan + Higashi-Kanto Expressway, ~75 km
    // SQ 634 arrives 21:55 → late-night light traffic → ~1h by chartered coach
    busDuration: '~1h',
  },
};

export function getItineraryForAirline(airlineKey) {
  const cfg = DAY1_BY_AIRLINE[airlineKey] || DAY1_BY_AIRLINE.cathay;

  return ITINERARY.map((day) => {
    if (day.day !== 1) return day;
    return {
      ...day,
      segments: [
        { from: 'Penang (PEN)', to: cfg.airportLabel,           mode: MODE.FLIGHT, duration: 'See flight details' },
        { from: cfg.airportLabel, to: 'Narita Tobu Hotel Airport', mode: MODE.BUS, duration: cfg.busDuration },
      ],
      mapPoints: [
        {
          lat: cfg.airportCoords[0],
          lng: cfg.airportCoords[1],
          label: cfg.airportLabel,
          type: 'airport',
          googleUrl: cfg.airportUrl,
        },
      ],
      polylines: [
        { points: [cfg.airportCoords, HOTEL_LL], mode: MODE.BUS },
      ],
    };
  });
}
