import { TRIPS, parseDate, fmtDate, addDays, getAirline } from '../data/trips';
import { FLIGHTS } from '../data/flights';

export default function TripSelector({ tripId, onChange }) {
  const trip = TRIPS.find(t => t.id === tripId);
  const airline = getAirline(tripId);
  const fl = airline ? FLIGHTS[airline] : null;

  const start = trip ? parseDate(trip.start) : null;
  const end   = start ? addDays(start, 7) : null;

  return (
    <div className="selector-bar">
      <div className="selector-left">
        <label className="ctrl-label" htmlFor="tripSel">Trip Batch</label>
        <div className="select-wrap">
          <select
            id="tripSel"
            value={tripId}
            onChange={e => onChange(Number(e.target.value))}
          >
            {TRIPS.map(t => (
              <option key={t.id} value={t.id}>Trip {t.id}</option>
            ))}
          </select>
        </div>

        {start && (
          <div className="date-chip">
            <span className="dc-label">Dates</span>
            <span className="dc-val">{fmtDate(start)}</span>
            <span className="dc-sep">→</span>
            <span className="dc-val">{fmtDate(end)}</span>
            <span className="dc-sep">·</span>
            <span className="dc-val dc-muted">8D 7N</span>
          </div>
        )}
      </div>

      {fl && (
        <div className="airline-chip" style={{ background: fl.bgColor, borderColor: fl.color + '55' }}>
          <span className="airline-dot" style={{ background: fl.color }} />
          <span className="airline-name" style={{ color: fl.color }}>{fl.airline}</span>
          <span className="airline-bag">✈ {fl.baggage} baggage</span>
        </div>
      )}
    </div>
  );
}
