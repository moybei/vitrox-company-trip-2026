import { FLIGHTS } from '../data/flights';

function flightStatusUrl(flightNo) {
  // Opens Google search which shows the live flight-status card at the top
  return `https://www.google.com/search?q=${encodeURIComponent(flightNo + ' flight status')}`;
}

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
        <td className="fn">
          <a
            className="ft-link"
            href={flightStatusUrl(r.flight)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Check ${r.flight} live status`}
          >
            {r.flight}
            <span className="ft-link-ico" aria-hidden="true">↗</span>
          </a>
        </td>
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

      <div className="fi-foot">Tap flight number to check live status</div>
    </div>
  );
}
