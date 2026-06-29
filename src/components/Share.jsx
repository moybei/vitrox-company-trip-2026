import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const APP_URL = 'https://moybei.github.io/vitrox-company-trip-2026/';

export default function Share({ updateServiceWorker }) {
  const [copied, setCopied] = useState(false);
  const [reloadState, setReloadState] = useState('idle'); // 'idle' | 'busy' | 'offline'

  function copyLink() {
    navigator.clipboard?.writeText(APP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  async function forceRefresh() {
    if (reloadState === 'busy') return;

    // If clearly offline, do nothing destructive — just flash a hint.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setReloadState('offline');
      setTimeout(() => setReloadState('idle'), 2200);
      return;
    }

    setReloadState('busy');

    // Best effort: ask the service worker to check the server for a new version.
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.update()));
      }
    } catch { /* ignore — fall through to plain reload */ }

    // If vite-plugin-pwa surfaced an updated SW, this activates it + reloads.
    // If no update is waiting, it's a no-op and we fall back to a hard reload below.
    try {
      if (typeof updateServiceWorker === 'function') {
        updateServiceWorker(true);
      }
    } catch { /* ignore */ }

    // Fallback reload (also covers the no-new-SW case).
    setTimeout(() => { window.location.reload(); }, 300);
  }

  const reloadLabel =
    reloadState === 'busy'    ? 'Refreshing…' :
    reloadState === 'offline' ? 'No internet — try later' :
                                'Check for updates';

  return (
    <div className="sh-page">
      <div className="sh-card">
        <div className="sh-hdr">
          <span className="sh-emoji">📱</span>
          <span className="sh-title">Share this app</span>
        </div>
        <p className="sh-sub">Scan the QR code or copy the link to install on your phone.</p>

        <div className="sh-qr-wrap">
          <QRCodeSVG
            value={APP_URL}
            size={220}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
            marginSize={2}
          />
        </div>

        <div className="sh-link-row">
          <span className="sh-link">{APP_URL.replace('https://', '')}</span>
          <button className="sh-copy-btn" onClick={copyLink}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="sh-tip">
          <div><strong>iOS:</strong> Safari → Share → Add to Home Screen</div>
          <div><strong>Android:</strong> Chrome → ⋮ → Install app</div>
        </div>

        <div className="sh-feedback">
          Got a feature idea or spotted a bug?<br />
          Ping me on Google Chat — <strong>Moy Haobei</strong>.<br />
          I’ll try to fix or add it as soon as possible!
        </div>
      </div>

      <button
        className={`sh-reload-btn sh-reload-btn--${reloadState}`}
        onClick={forceRefresh}
        disabled={reloadState === 'busy'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>{reloadLabel}</span>
      </button>
      <p className="sh-reload-hint">
        Tap if the app feels stuck on an old version.
      </p>
    </div>
  );
}
