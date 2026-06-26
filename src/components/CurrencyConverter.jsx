import { useState } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';

const CURRENCIES = {
  MYR: { code: 'my', name: 'Malaysian Ringgit' },
  JPY: { code: 'jp', name: 'Japanese Yen'      },
};

function fmtResult(n, ccy) {
  if (ccy === 'JPY') return Math.round(n).toLocaleString('en-MY');
  return n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CurrencyConverter() {
  const { rate, updatedAt, fetching } = useExchangeRate();
  const [amount, setAmount] = useState('100');
  const [toJpy,  setToJpy]  = useState(true); // true = MYR→JPY, false = JPY→MYR

  const fromCcy = toJpy ? 'MYR' : 'JPY';
  const toCcy   = toJpy ? 'JPY' : 'MYR';
  const num     = parseFloat(amount) || 0;
  const resultNum = rate ? (toJpy ? num * rate : num / rate) : null;
  const resultStr = resultNum !== null ? fmtResult(resultNum, toCcy) : '—';

  function handleSwap() {
    // The current result becomes the new input
    if (rate && resultNum !== null) {
      setAmount(toJpy
        ? String(Math.round(resultNum))          // JPY → whole number
        : resultNum.toFixed(2));                 // MYR → 2dp
    }
    setToJpy((v) => !v);
  }

  const rateText = rate
    ? toJpy
      ? `1 MYR = ${rate.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} JPY`
      : `100 JPY = ${(100 / rate).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} MYR`
    : null;

  const lastUpdated = updatedAt
    ? new Date(updatedAt).toLocaleString('en-MY', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className="cc-page">
      <div className="cc-card">

        {/* ── FROM (editable) ── */}
        <div className="cc-block cc-block--from">
          <div className="cc-ccy">
            <img className="cc-flag" src={`https://flagcdn.com/w40/${CURRENCIES[fromCcy].code}.png`} alt={fromCcy} />
            <div className="cc-ccy-text">
              <span className="cc-code">{fromCcy}</span>
              <span className="cc-name">{CURRENCIES[fromCcy].name}</span>
            </div>
          </div>
          <input
            className="cc-input"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              // Allow only digits and a single decimal point
              const v = e.target.value.replace(/[^\d.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1');
              setAmount(v);
            }}
            onFocus={(e) => e.target.select()}
            placeholder="0"
          />
        </div>

        {/* ── SWAP DIVIDER ── */}
        <div className="cc-divider">
          <div className="cc-divider-line" />
          <button className="cc-swap" onClick={handleSwap} aria-label="Swap currencies">⇅</button>
          <div className="cc-divider-line" />
        </div>

        {/* ── TO (read-only result) ── */}
        <div className="cc-block cc-block--to">
          <div className="cc-ccy">
            <img className="cc-flag" src={`https://flagcdn.com/w40/${CURRENCIES[toCcy].code}.png`} alt={toCcy} />
            <div className="cc-ccy-text">
              <span className="cc-code cc-code--to">{toCcy}</span>
              <span className="cc-name">{CURRENCIES[toCcy].name}</span>
            </div>
          </div>
          <span className={`cc-result${!rate ? ' cc-result--empty' : ''}`}>{resultStr}</span>
        </div>

        {/* ── RATE + SOURCE ── */}
        <div className="cc-footer">
          <div className="cc-rate-line">
            {rateText
              ? <>{rateText}{fetching && <span className="cc-spin"> ↻</span>}</>
              : <span className="cc-loading">Fetching rate…</span>}
          </div>
          <div className="cc-source">
            {lastUpdated && <span>Updated {lastUpdated} · </span>}
            Source: <a className="cc-src-link" href="https://open.er-api.com" target="_blank" rel="noreferrer">Open Exchange Rates</a>
          </div>
        </div>

      </div>
    </div>
  );
}
