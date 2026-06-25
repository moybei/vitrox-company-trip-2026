import { useState, useRef, useCallback } from 'react';
import './App.css';
import { TRIPS, parseDate, fmtDate, addDays, getAirline } from './data/trips';
import { FLIGHTS } from './data/flights';
import { ITINERARY } from './data/itinerary';
import FlightInfo from './components/FlightInfo';
import TripMap    from './components/TripMap';
import DayCard    from './components/DayCard';

export default function App() {
  const [tripId,      setTripId]      = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showFlight,  setShowFlight]  = useState(false);
  const mapRef    = useRef(null);

  const trip       = TRIPS.find((t) => t.id === tripId);
  const airlineKey = getAirline(tripId);
  const fl         = airlineKey ? FLIGHTS[airlineKey] : null;
  const start      = trip ? parseDate(trip.start) : null;
  const end        = start ? addDays(start, 7) : null;

  const handleSelectDay = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  function handleTripChange(id) {
    setTripId(id);
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

          <div className="ctrl-left">
            <label className="ctrl-lbl" htmlFor="tripSel">Trip</label>
            <div className="sel-wrap">
              <select
                id="tripSel"
                value={tripId}
                onChange={(e) => handleTripChange(Number(e.target.value))}
              >
                {TRIPS.map((t) => (
                  <option key={t.id} value={t.id}>Trip {t.id}</option>
                ))}
              </select>
            </div>

            {start && (
              <div className="date-badge">
                {fmtDate(start)}
                <span className="date-arrow">→</span>
                {fmtDate(end)}
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
            />
          ))}
        </div>
      </div>

      <footer className="ftr">
        2026 ViTrox Company Incentive Trip · Japan Tohoku 8D7N
      </footer>
    </div>
  );
}
