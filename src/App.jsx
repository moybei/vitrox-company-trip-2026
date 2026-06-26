import { useState, useRef, useCallback, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './App.css';
import { TRIPS, parseDate, fmtDate, addDays, getAirline } from './data/trips';
import { FLIGHTS } from './data/flights';
import { ITINERARY } from './data/itinerary';
import { useWeather } from './hooks/useWeather';
const TAB_KEY = 'vitrox-tab';
import FlightInfo        from './components/FlightInfo';
import TripMap           from './components/TripMap';
import DayCard           from './components/DayCard';
import CurrencyConverter from './components/CurrencyConverter';
import Checklist        from './components/Checklist';
import Splitter         from './components/Splitter';

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
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [tripId,      setTripId]      = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return saved && TRIPS.some((t) => t.id === saved) ? saved : 1;
  });
  const [tab,         setTab]         = useState(() => localStorage.getItem(TAB_KEY) || 'home');
  const isHome                         = tab === 'home';
  const [menuOpen,    setMenuOpen]    = useState(false);

  function goTo(t) {
    localStorage.setItem(TAB_KEY, t);
    setTab(t);
    setMenuOpen(false);
  }
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

      {/* ── UPDATE BANNER ───────────────────────────────── */}
      {needRefresh && (
        <div className="pwa-update-bar">
          <span>New version available</span>
          <button className="pwa-update-btn" onClick={() => updateServiceWorker(true)}>Reload</button>
        </div>
      )}

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <header className="hdr">
        <div className="hdr-inner">

          {/* Brand — links home */}
          <button className="hdr-brand" onClick={() => goTo('home')} aria-label="Home">
            <img src={`${import.meta.env.BASE_URL}japan-map.png`} alt="Japan map" className="hdr-flag" />
            <div className="hdr-text">
              <h1>ViTrox Japan Incentive Trip 2026</h1>
              <p>8D7N · Japan Tohoku · 32 Batches</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hdr-nav">
            <button className={`nav-tab${tab === 'currency' ? ' nav-tab--active' : ''}`} onClick={() => goTo('currency')}>
              💴 Currency
            </button>
            <button className={`nav-tab${tab === 'checklist' ? ' nav-tab--active' : ''}`} onClick={() => goTo('checklist')}>
              📋 Checklist
            </button>
            <button className={`nav-tab${tab === 'splitter' ? ' nav-tab--active' : ''}`} onClick={() => goTo('splitter')}>
              💰 Split
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`hdr-burger${menuOpen ? ' hdr-burger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile dropdown — always rendered, animated via CSS */}
        <div className={`hdr-mobile-menu${menuOpen ? ' hdr-mobile-menu--open' : ''}`}>
          <div className="hdr-mobile-inner">
            <button className="hdr-mobile-link" onClick={() => goTo('currency')}>
              <span className="hdr-mobile-icon">💴</span>
              <span>Currency</span>
            </button>
            <button className="hdr-mobile-link" onClick={() => goTo('checklist')}>
              <span className="hdr-mobile-icon">📋</span>
              <span>Checklist</span>
            </button>
            <button className="hdr-mobile-link" onClick={() => goTo('splitter')}>
              <span className="hdr-mobile-icon">💰</span>
              <span>Split</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── ITINERARY PAGE ──────────────────────────────── */}
      {isHome && (
        <div className="tab-page">
          {/* ── CONTROLS ── */}
          <div className="ctrl-bar">
            <div className="ctrl-bar-inner">

              <div className="ctrl-left" ref={pickerRef}>
                {/* ── DATE BADGE SELECTOR ── */}
                <button
                  className={`date-badge date-badge--btn${showPicker ? ' date-badge--open' : ''}`}
                  onClick={() => setShowPicker((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={showPicker}
                >
                  <span className="date-badge-trip">Trip {tripId}</span>
                  {start && <span className="date-badge-sep">·</span>}
                  {start && `${fmtDate(start)} – ${fmtDate(end)}`}
                  {start && countdownLabel(getDaysUntil(start)) && (
                    <span className="date-badge-cd">· {countdownLabel(getDaysUntil(start))}</span>
                  )}
                </button>

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

            {/* ── FLIGHT PANEL (overlay dropdown) ── */}
            {fl && (
              <div className={`fi-wrap${showFlight ? ' fi-wrap--open' : ''}`}>
                <div className="fi-inner">
                  <FlightInfo airlineKey={airlineKey} />
                </div>
              </div>
            )}
          </div>

          {/* ── MAIN ── */}
          <div className="layout">
            <div ref={mapRef} className="col-map">
              <TripMap selectedDay={selectedDay} onSelectDay={handleSelectDay} />
            </div>
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
        </div>
      )}

      {/* ── CURRENCY PAGE ───────────────────────────────── */}
      {tab === 'currency' && <div className="tab-page"><CurrencyConverter /></div>}

      {/* ── CHECKLIST PAGE ──────────────────────────────── */}
      {tab === 'checklist' && <div className="tab-page"><Checklist /></div>}

      {/* ── SPLITTER PAGE ───────────────────────────────── */}
      {tab === 'splitter' && <div className="tab-page"><Splitter /></div>}

      <footer className="ftr">
        2026 ViTrox Company Incentive Trip · Japan Tohoku 8D7N
      </footer>

    </div>
  );
}
