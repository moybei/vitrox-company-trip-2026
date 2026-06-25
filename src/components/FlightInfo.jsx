import { FLIGHTS } from '../data/flights';

export default function FlightInfo({ airlineKey }) {
  if (!airlineKey) return null;
  const fl = FLIGHTS[airlineKey];
  if (!fl) return null;

  const Row = ({ r }) =>
    r.layover ? (
      <tr className="lyr">
        <td colSpan={5}>↩ Layover — {r.route} · {r.duration}</td>
      </tr>
    ) : (
      <tr>
        <td className="fn">{r.flight}</td>
        <td>{r.route}</td>
        <td>{r.dep}</td>
        <td>{r.arr}</td>
        <td className="dur">{r.duration}</td>
      </tr>
    );

  return (
    <div
      className="flight-info"
      style={{ borderColor: fl.color + '44', background: fl.bgColor }}
    >
      <div className="fi-top">
        <div className="fi-airline" style={{ color: fl.color }}>
          <span className="fi-dot" />
          {fl.airline}
        </div>
        <div className="fi-meta">
          <span>🧳 Baggage: <strong>{fl.baggage}</strong></span>
          <span>⏱ Total: <strong>{fl.totalTime}</strong></span>
        </div>
      </div>

      <div className="fi-grids">
        <div>
          <div className="fi-grp-lbl">Outbound (PEN → Japan)</div>
          <table className="ft">
            <thead>
              <tr>
                <th>Flight</th><th>Route</th><th>ETD</th><th>ETA</th><th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {fl.outbound.map((r, i) => <Row key={i} r={r} />)}
            </tbody>
          </table>
        </div>
        <div>
          <div className="fi-grp-lbl">Inbound (Japan → PEN)</div>
          <table className="ft">
            <thead>
              <tr>
                <th>Flight</th><th>Route</th><th>ETD</th><th>ETA</th><th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {fl.inbound.map((r, i) => <Row key={i} r={r} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
