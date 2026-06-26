import { useState } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';

const fmt = (n, decimals) =>
  n.toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export default function CurrencyConverter() {
  const { rate, updatedAt, fetching } = useExchangeRate();
  const [amount, setAmount] = useState('100');
  const [toJpy,  setToJpy]  = useState(true); // true = MYR→JPY, false = JPY→MYR

  const num    = parseFloat(amount) || 0;
  const result = rate
    ? toJpy
      ? fmt(num * rate, 0)
      : fmt(num / rate, 2)
    : '—';

  const fromCcy = toJpy ? 'MYR' : 'JPY';
  const toCcy   = toJpy ? 'JPY' : 'MYR';

  const rateLine = rate
    ? toJpy
      ? `1 MYR = ${fmt(rate, 2)} JPY`
      : `100 JPY = ${fmt(100 / rate, 4)} MYR`
    : null;

  const lastUpdated = updatedAt
    ? new Date(updatedAt).toLocaleString('en-MY', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className="cc-page">
      <div className="cc-card">

        {/* ── FROM row ── */}
        <div className="cc-row">
          <span className="cc-label">{fromCcy}</span>
          <input
            className="cc-input"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* ── SWAP ── */}
        <button className="cc-swap" onClick={() => setToJpy((v) => !v)} aria-label="Swap currencies">
          ⇅
        </button>

        {/* ── TO row ── */}
        <div className="cc-row cc-row--result">
          <span className="cc-label cc-label--to">{toCcy}</span>
          <span className="cc-result">{result}</span>
        </div>

        {/* ── RATE LINE ── */}
        <div className="cc-rate">
          {rateLine
            ? <>{rateLine}{fetching && <span className="cc-spin"> ↻</span>}</>
            : <span className="cc-loading">Fetching rate…</span>}
          {lastUpdated && !fetching && (
            <span className="cc-updated"> · {lastUpdated}</span>
          )}
        </div>

      </div>
    </div>
  );
}
