import { useState, useEffect, useLayoutEffect } from 'react';

// WMO weather code → emoji
const WMO = {
  0: '☀️',
  1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  66: '🌨️', 67: '🌨️',
  71: '❄️',  73: '❄️',  75: '❄️',  77: '🌨️',
  80: '🌦️', 81: '🌦️', 82: '🌦️',
  85: '❄️',  86: '❄️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

// Use local date parts to avoid UTC offset shifting the date (e.g. UTC+8 midnight → UTC prev day)
function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── localStorage helpers ──────────────────────────────────────────────────
const LS_PREFIX = 'vitrox-weather-';

function lsLoad(tripStart) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + toYMD(tripStart));
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function lsSaveMerge(tripStart, dayNum, entry) {
  try {
    const key = LS_PREFIX + toYMD(tripStart);
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    existing[dayNum] = entry;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {}
}

// ── In-memory dedup cache (current session) ───────────────────────────────
const mem = new Map();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) await sleep(2000); // 2s flat interval between retries
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status === 429) continue;
    console.warn(`[weather] ${res.status}`, await res.text().catch(() => ''));
    return null;
  }
  console.warn('[weather] max retries reached for', url);
  return null;
}

async function fetchDayWeather(lat, lng, tripDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((tripDate - today) / 86400000);

  let apiDate;
  let baseUrl;

  if (diffDays <= 16) {
    apiDate = tripDate;
    baseUrl = 'https://api.open-meteo.com/v1/forecast';
  } else {
    apiDate = new Date(tripDate);
    apiDate.setFullYear(apiDate.getFullYear() - 1);
    baseUrl = 'https://archive-api.open-meteo.com/v1/archive';
  }

  const dateStr = toYMD(apiDate);
  const cacheKey = `${lat},${lng},${dateStr}`;
  if (mem.has(cacheKey)) return mem.get(cacheKey);

  const url =
    `${baseUrl}?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=Asia/Tokyo&start_date=${dateStr}&end_date=${dateStr}`;

  const res = await fetchWithRetry(url);
  if (!res) return null;
  const data = await res.json();

  const result = {
    max:  Math.round(data.daily.temperature_2m_max[0]),
    min:  Math.round(data.daily.temperature_2m_min[0]),
    icon: WMO[data.daily.weathercode[0]] ?? '🌡️',
  };

  mem.set(cacheKey, result);
  return result;
}

/**
 * Stale-while-revalidate weather hook.
 * 1. Instantly restores cached weather from localStorage (no skeleton flash on reload)
 * 2. Silently re-fetches fresh data in the background
 * 3. Swaps in new data per-day as each request resolves, saves back to localStorage
 *
 * Returns { weather: { [dayNumber]: { max, min, icon } }, loading: boolean }
 * `loading` is only true for days that have NO cached data yet.
 */
export function useWeather(tripStart, itinerary) {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  // Restore from localStorage synchronously before paint - no skeleton flash on reload
  useLayoutEffect(() => {
    if (!tripStart) { setWeather({}); setLoading(false); return; }
    const cached = lsLoad(tripStart);
    setWeather(cached);
    setLoading(Object.keys(cached).length < (itinerary?.length ?? 8));
  }, [tripStart?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Background re-fetch (stale-while-revalidate)
  useEffect(() => {
    if (!tripStart || !itinerary) return;
    let cancelled = false;
    let pending = itinerary.length;

    itinerary.forEach(async (day, index) => {
      if (index > 0) await sleep(index * 150); // stagger to avoid 429
      if (cancelled) { --pending; return; }

      const lat = day.hotel?.lat ?? day.mapPoints?.[0]?.lat;
      const lng = day.hotel?.lng ?? day.mapPoints?.[0]?.lng;

      if (lat == null || lng == null) {
        if (!cancelled && --pending === 0) setLoading(false);
        return;
      }

      const date = new Date(tripStart);
      date.setDate(date.getDate() + day.day - 1);

      try {
        const w = await fetchDayWeather(lat, lng, date);
        if (!cancelled && w) {
          setWeather((prev) => ({ ...prev, [day.day]: w }));
          lsSaveMerge(tripStart, day.day, w);
        }
      } catch (err) {
        console.warn(`[weather] day ${day.day}:`, err);
      } finally {
        if (!cancelled && --pending === 0) setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [tripStart?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  return { weather, loading };
}
