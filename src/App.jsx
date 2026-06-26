import { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import { TRIPS, parseDate, fmtDate, addDays, getAirline } from './data/trips';
import { FLIGHTS } from './data/flights';
import { ITINERARY } from './data/itinerary';
import { useWeather } from './hooks/useWeather';
import FlightInfo from './components/FlightInfo';
import TripMap    from './components/TripMap';
import DayCard    from './components/DayCard';

const STORAGE_KEY = 'vitrox-trip-id';

// Countdown helpers
function getDaysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}
function countdownLabel(days) {
  if (days > 1)   return `in ${days} days`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today!';
  if (days >= -7) return 'Ongoing';
  return null;
}
function countdownMod(days) {
  if (days > 0)  return 'cd--soon';
  if (days >= 0) return 'cd--today';
  return 'cd--active';
}

export default function App() {
  const [tripId,      setTripId]      = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return saved && TRIPS.some((t) => t.id === saved) ? saved : 1;
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [showFlight,  setShowFlight]  = useState(false);
  const [showPicker,  setShowPicker]  = useState(false);
  const mapRef       = useRef(null);
  const pickerRef    = useRef(null);

  // Close trip picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    function handleOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showPicker]);

  const trip       = TRIPS.find((t) => t.id === tripId);
  const airlineKey = getAirline(tripId);
  const fl         = airlineKey ? FLIGHTS[airlineKey] : null;
  const start      = trip ? parseDate(trip.start) : null;
  const end        = start ? addDays(start, 7) : null;

  const { weather, loading: weatherLoading } = useWeather(start, ITINERARY);

  // Forecast data is only available 16 days ahead; beyond that we use last year's archive
  const forecastCutoff = new Date();
  forecastCutoff.setDate(forecastCutoff.getDate() + 16);
  const weatherIsHistorical = start && start > forecastCutoff;

  const handleSelectDay = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  function handleTripChange(id) {
    setTripId(id);
    localStorage.setItem(STORAGE_KEY, id);
    setSelectedDay(null);
    setShowFlight(false);
  }

  return (
    <div className="app">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="hdr">
        <div className="hdr-inner">
          <img src={`${import.meta.env.BASE_URL}japan-map.png`} alt="Japan map" className="hdr-flag" />
          <div className="hdr-text">
            <h1>ViTrox Japan Incentive Trip 2026</h1>
            <p>8D7N · Japan Tohoku · 32 Batches</p>
          </div>
        </div>
      </header>

      {/* ── CONTROLS ────────────────────────────────────── */}
      <div className="ctrl-bar">
        <div className="ctrl-bar-inner">

          <div className="ctrl-left" ref={pickerRef}>
            {/* ── TRIP ROW (flat) ── */}
            <div className="trip-row">
              <div className="trip-row-text">
                <span className="trip-row-id">Trip {tripId}</span>
                {start && (
                  <span className="trip-row-dates">{fmtDate(start)} – {fmtDate(end)}</span>
                )}
              </div>
              <button
                className={`trip-cd-btn ${start ? countdownMod(getDaysUntil(start)) : 'cd--neutral'}${showPicker ? ' trip-cd-btn--open' : ''}`}
                onClick={() => setShowPicker((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={showPicker}
              >
                {start ? (countdownLabel(getDaysUntil(start)) ?? 'Select') : 'Select'}
              </button>
            </div>

            {/* ── TRIP DROPDOWN ── */}
            {showPicker && (
              <div className="trip-dd" role="listbox" aria-label="Select trip batch">
                {TRIPS.map((t) => {
                  const s   = parseDate(t.start);
                  const e   = addDays(s, 7);
                  const days = getDaysUntil(s);
                  const cd  = countdownLabel(days);
                  return (
                    <button
                      key={t.id}
                      role="option"
                      aria-selected={t.id === tripId}
                      className={`trip-dd-item${t.id === tripId ? ' trip-dd-item--active' : ''}`}
                      onClick={() => { handleTripChange(t.id); setShowPicker(false); }}
                    >
                      <span className="trip-dd-id">Trip {t.id}</span>
                      <span className="trip-dd-dates">{fmtDate(s)} – {fmtDate(e)}</span>
                      {cd && <span className={`trip-dd-cd ${countdownMod(days)}`}>{cd}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {fl && (
            <button
              className={`fl-btn${showFlight ? ' fl-btn--open' : ''}`}
              style={{ '--fl-color': fl.color, '--fl-bg': fl.bgColor }}
              onClick={() => setShowFlight((v) => !v)}
            >
              <span className="fl-dot" />
              <span className="fl-name">{fl.airline}</span>
              <span className="fl-bag">{fl.baggage}</span>
              <span className={`fl-chevron${showFlight ? ' fl-chevron--open' : ''}`}>▼</span>
            </button>
          )}
        </div>

        {/* ── FLIGHT PANEL (overlay dropdown) ─────────── */}
        {fl && (
          <div
            className={`fi-wrap${showFlight ? ' fi-wrap--open' : ''}`}
          >
            <div className="fi-inner">
              <FlightInfo airlineKey={airlineKey} />
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="layout">

        {/* Map column */}
        <div ref={mapRef} className="col-map">
          <TripMap selectedDay={selectedDay} onSelectDay={handleSelectDay} />
        </div>

        {/* Cards column */}
        <div className="col-cards">
          <div className="cards-hdr">
            <span className="cards-hdr-title">Day-by-Day Itinerary</span>
          </div>

          {start && ITINERARY.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              tripStart={start}
              isSelected={selectedDay === day.day}
              onSelect={handleSelectDay}
              weather={weather[day.day]}
              weatherLoading={weatherLoading}
            />
          ))}

          {weatherIsHistorical && (
            <p className="weather-notice">
              🗓️ Weather shown is historical data from last year — live forecast is only available up to {forecastCutoff.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
            </p>
          )}
        </div>
      </div>

      <footer className="ftr">
        2026 ViTrox Company Incentive Trip · Japan Tohoku 8D7N
      </footer>
    </div>
  );
}
