import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ITINERARY, MODE_STYLE } from '../data/itinerary';

const gmap = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

const mkStop = (n, on) => L.divIcon({
  html: `<div class="lm-stop${on ? ' lm-stop--on' : ''}">${n}</div>`,
  className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -17],
});
const mkHotel = (on) => L.divIcon({
  html: `<div class="lm-hotel${on ? ' lm-hotel--on' : ''}">🏨</div>`,
  className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18],
});
const mkAttr = () => L.divIcon({
  html: '<div class="lm-attr">⭐</div>',
  className: '', iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -15],
});
const mkAirport = () => L.divIcon({
  html: '<div class="lm-airport">✈️</div>',
  className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -17],
});

const popupHtml = (inner) =>
  `<div class="mp">${inner}</div>`;

export default function TripMap({ selectedDay, onSelectDay }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layersRef    = useRef([]);

  // Init Leaflet map once
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [37.6, 140.0],
      zoom: 7,
      zoomControl: false,
    });
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Re-render markers/routes when selectedDay changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];

    const add = (l) => { l.addTo(map); layersRef.current.push(l); return l; };
    const mkPopup = (html) => L.popup({ className: 'lf-popup', maxWidth: 250 }).setContent(html);

    if (selectedDay === null) {
      // ── OVERVIEW: full route + night hotel number markers ──────
      const bounds = [];
      const seenHotels   = new Set();
      const seenAirports = new Set();

      ITINERARY.forEach((day) => {
        // Route lines (all legs, slightly dimmed)
        day.polylines.forEach((pl) => {
          const s = MODE_STYLE[pl.mode];
          add(L.polyline(pl.points, {
            color: s.color, weight: s.weight, dashArray: s.dashArray, opacity: 0.55,
          }));
        });

        // Night hotel: numbered marker (deduped — nights 6+7 share same hotel)
        if (day.hotel) {
          const hKey = `${day.hotel.lat},${day.hotel.lng}`;
          if (!seenHotels.has(hKey)) {
            seenHotels.add(hKey);
            bounds.push([day.hotel.lat, day.hotel.lng]);
            add(
              L.marker([day.hotel.lat, day.hotel.lng], { icon: mkStop(day.hotel.night, false) })
                .bindTooltip(`Night ${day.hotel.night}: ${day.hotel.name}`, { direction: 'top', sticky: true })
                .bindPopup(mkPopup(popupHtml(`
                  <div class="mp-tag">🌙 Night ${day.hotel.night}</div>
                  <div class="mp-name">${day.hotel.name}</div>
                  <a href="${day.hotel.googleUrl}" target="_blank" rel="noopener" class="mp-link">📍 Open Google Maps ↗</a>
                `)))
                .on('click', () => onSelectDay(day.day))
            );
          }
        }

        // Airport markers (deduped — Narita appears on Day 1 + Day 8)
        day.mapPoints.filter(p => p.type === 'airport').forEach(pt => {
          const aKey = `${pt.lat},${pt.lng}`;
          if (!seenAirports.has(aKey)) {
            seenAirports.add(aKey);
            bounds.push([pt.lat, pt.lng]);
            add(
              L.marker([pt.lat, pt.lng], { icon: mkAirport() })
                .bindTooltip(pt.label, { direction: 'top', sticky: true })
                .on('click', () => onSelectDay(day.day))
            );
          }
        });
      });

      if (bounds.length) {
        map.fitBounds(L.latLngBounds(bounds).pad(0.1), { animate: true });
      }
    } else {
      // ── DAY DETAIL: route + attractions + prev/current night markers ──
      const day = ITINERARY.find((d) => d.day === selectedDay);
      if (!day) return;

      const bounds = [];

      // Route polylines (highlighted) with mode tooltip
      const segsByMode = {};
      (day.segments || []).forEach(seg => {
        if (!segsByMode[seg.mode]) segsByMode[seg.mode] = [];
        segsByMode[seg.mode].push(seg);
      });
      const polyModeIdx = {};
      day.polylines.forEach((pl) => {
        const s = MODE_STYLE[pl.mode];
        const idx = polyModeIdx[pl.mode] || 0;
        polyModeIdx[pl.mode] = idx + 1;
        const seg = (segsByMode[pl.mode] || [])[idx];
        const tip = seg ? `${seg.from} → ${seg.to} · ${seg.duration}` : '';
        const line = L.polyline(pl.points, {
          color: s.color, weight: s.weight + 2, dashArray: s.dashArray, opacity: 0.92,
        });
        if (tip) line.bindTooltip(tip, { sticky: true, direction: 'top' });
        add(line);
        pl.points.forEach((p) => bounds.push(p));
      });

      // Previous night hotel → shows numbered departure marker
      const prevDay = ITINERARY.find((d) => d.day === day.day - 1);
      if (prevDay?.hotel) {
        const sameLoc =
          day.hotel &&
          prevDay.hotel.lat === day.hotel.lat &&
          prevDay.hotel.lng === day.hotel.lng;
        if (!sameLoc) {
          bounds.push([prevDay.hotel.lat, prevDay.hotel.lng]);
          add(
            L.marker([prevDay.hotel.lat, prevDay.hotel.lng], { icon: mkStop(prevDay.hotel.night, false) })
              .bindTooltip(`Night ${prevDay.hotel.night}: ${prevDay.hotel.name}`, { direction: 'top', sticky: true })
              .bindPopup(mkPopup(popupHtml(`
                <div class="mp-tag">🌙 Night ${prevDay.hotel.night} (prev)</div>
                <div class="mp-name">${prevDay.hotel.name}</div>
                <a href="${prevDay.hotel.googleUrl}" target="_blank" rel="noopener" class="mp-link">📍 Open Google Maps ↗</a>
              `)))
          );
        }
      }

      // Attractions and airports from mapPoints
      day.mapPoints.forEach((pt) => {
        if (pt.type !== 'attraction' && pt.type !== 'airport') return;
        bounds.push([pt.lat, pt.lng]);
        const isAirport = pt.type === 'airport';
        add(
          L.marker([pt.lat, pt.lng], { icon: isAirport ? mkAirport() : mkAttr() })
            .bindPopup(mkPopup(popupHtml(`
              <div class="mp-tag">${isAirport ? '✈️ Airport' : '🌟 Attraction'}</div>
              <div class="mp-name">${pt.label}</div>
              <a href="${pt.googleUrl || gmap(pt.lat, pt.lng)}" target="_blank" rel="noopener" class="mp-link">📍 View on Google Maps ↗</a>
            `)))
        );
      });

      // Current night hotel → highlighted numbered destination marker
      if (day.hotel) {
        bounds.push([day.hotel.lat, day.hotel.lng]);
        add(
          L.marker([day.hotel.lat, day.hotel.lng], { icon: mkStop(day.hotel.night, true) })
            .bindTooltip(`Night ${day.hotel.night}: ${day.hotel.name}`, { direction: 'top', sticky: true })
            .bindPopup(mkPopup(popupHtml(`
              <div class="mp-tag">🌙 Night ${day.hotel.night}</div>
              <div class="mp-name">${day.hotel.name}</div>
              <a href="${day.hotel.googleUrl}" target="_blank" rel="noopener" class="mp-link">📍 View on Google Maps ↗</a>
            `)))
        );
      }

      if (bounds.length) {
        map.fitBounds(L.latLngBounds(bounds).pad(0.35), { animate: true, duration: 0.5 });
      }
    }
  }, [selectedDay, onSelectDay]);

  return (
    <div className="map-panel">
      <div className="map-panel-hdr">
        <span className="map-panel-title">🗺 Route Map</span>
        <div className="map-panel-actions">
          {selectedDay ? (
            <button className="map-back-btn" onClick={() => onSelectDay(null)}>
              ← Full Route
            </button>
          ) : (
            <span className="map-hint">Tap a day marker or card</span>
          )}
        </div>
      </div>
      <div ref={containerRef} className="map-body" />
      <div className="map-legend">
        <span className="ml-item">
          <span className="ml-line ml-shinkansen" />Shinkansen
        </span>
        <span className="ml-item">
          <span className="ml-line ml-bus" />Bus
        </span>
        <span className="ml-item"><span className="ml-night-badge">N</span> Night hotel</span>
        <span className="ml-item">⭐ Attraction</span>
      </div>
    </div>
  );
}
