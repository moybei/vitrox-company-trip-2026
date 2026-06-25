import { useRef, useEffect, useState } from 'react';
import { fmtDate, fmtWeekday, addDays } from '../data/trips';
import { MODE_LABEL } from '../data/itinerary';

const TYPE_COLORS = {
  travel:  { accent: '#2563eb', bg: '#dbeafe' },
  explore: { accent: '#0891b2', bg: '#cffafe' },
  nature:  { accent: '#7c3aed', bg: '#ede9fe' },
  culture: { accent: '#d97706', bg: '#fef3c7' },
  shrine:  { accent: '#e11d48', bg: '#ffe4e6' },
  park:    { accent: '#059669', bg: '#d1fae5' },
  city:    { accent: '#c026d3', bg: '#fae8ff' },
};

export default function DayCard({ day, tripStart, isSelected, onSelect }) {
  const date    = addDays(tripStart, day.day - 1);
  const colors  = TYPE_COLORS[day.type] || TYPE_COLORS.travel;
  const cardRef = useRef(null);
  const bodyRef = useRef(null);
  const [bodyH, setBodyH] = useState(0);

  // Measure content height once on mount (content is static)
  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight);
  }, []);

  // Scroll after expand/collapse once animation completes (~320ms)
  useEffect(() => {
    if (!cardRef.current) return;
    const timer = setTimeout(() => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      if (isSelected) {
        // After expand: scroll down if card bottom is cut off
        const bottomGap = 24;
        const overflow = rect.bottom + bottomGap - window.innerHeight;
        if (overflow > 0) window.scrollBy({ top: overflow, behavior: 'smooth' });
      } else {
        // After collapse: scroll up if card header is above viewport
        if (rect.top < 0) window.scrollBy({ top: rect.top - 12, behavior: 'smooth' });
      }
    }, 340);
    return () => clearTimeout(timer);
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      className={`dc${isSelected ? ' dc--selected' : ''}`}
      style={{ '--dc-accent': colors.accent, '--dc-bg': colors.bg }}
      onClick={() => onSelect(isSelected ? null : day.day)}
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(isSelected ? null : day.day)}
    >
      {/* ── Header row ── */}
      <div className="dc-hdr">
        <div className="dc-badge">
          <span className="dc-badge-num">{day.day}</span>
        </div>
        <div className="dc-info">
          <div className="dc-title">{day.icon} {day.title}</div>
          <div className="dc-date">
            <strong>{fmtDate(date)}</strong>
            <span className="dc-sep">·</span>
            {fmtWeekday(date)}
          </div>
        </div>
        <span className={`dc-arrow${isSelected ? ' dc-arrow--open' : ''}`} aria-hidden="true">▼</span>
      </div>

      {/* ── Expanded body ── */}
      <div className="dc-body-wrap" style={{ height: isSelected ? bodyH : 0 }}>
        <div ref={bodyRef}>
          <div className="dc-body" onClick={(e) => e.stopPropagation()}>

          {/* Travel segments */}
          {day.segments.length > 0 && (
            <div className="dc-segments">
              {day.segments.map((seg, i) => {
                const m = MODE_LABEL[seg.mode];
                return (
                  <div key={i} className="dc-seg">
                    <span
                      className="seg-mode"
                      style={{ background: m.bg, color: m.text }}
                    >
                      {m.icon} {m.label}
                    </span>
                    <span className="seg-route">{seg.from} → {seg.to}</span>
                    <span className="seg-dur">⏱ {seg.duration}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Attractions */}
          {day.attractions.length > 0 && (
            <div className="dc-section">
              <div className="dc-section-lbl">🌟 Attractions</div>
              <div className="dc-pills">
                {day.attractions.map((a) => (
                  <a
                    key={a.name}
                    href={a.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attr-pill"
                  >
                    {a.name}
                    <span className="attr-pill-icon">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Hotel */}
          {day.hotel && (
            <a
              href={day.hotel.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dc-hotel"
            >
              <span className="dc-hotel-night">🌙 Night {day.hotel.night}</span>
              <span className="dc-hotel-name">🏨 {day.hotel.name}</span>
              <span className="dc-hotel-cta">Maps ↗</span>
            </a>
          )}

          {/* Flight day note */}
          {day.attractions.length === 0 &&
           day.segments.some((s) => s.mode === 'flight') && (
            <p className="dc-note">
              ✈️ Refer to the flight schedule above for departure times.
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
