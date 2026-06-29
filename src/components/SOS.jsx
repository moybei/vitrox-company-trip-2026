// Emergency / SOS page — quick-dial Japan emergency numbers, Malaysia Embassy
// contact, Tourist Helpline, and a shortcut to the Phrases > Emergency group.

const PHRASES_TAB_KEY = 'vitrox-phrases-tab';

export default function SOS({ goTo }) {
  function openEmergencyPhrases() {
    try { localStorage.setItem(PHRASES_TAB_KEY, 'emergency'); } catch { /* ignore */ }
    goTo?.('phrases');
  }

  return (
    <div className="sos-page">
      {/* JAPAN EMERGENCY */}
      <div className="sos-section-lbl">Japan Emergency · 緊急</div>
      <div className="sos-row sos-row--emergency">
        <a className="sos-call sos-call--police" href="tel:110">
          <span className="sos-call-num">110</span>
          <span className="sos-call-lbl">Police · 警察</span>
        </a>
        <a className="sos-call sos-call--ambulance" href="tel:119">
          <span className="sos-call-num">119</span>
          <span className="sos-call-lbl">Fire · Ambulance · 救急</span>
        </a>
      </div>
      <p className="sos-tip">
        Free from any phone, including unregistered SIMs. Operators may not speak English —
        if so, say <strong>“Eigo onegaishimasu”</strong> (English please).
      </p>

      {/* MALAYSIA EMBASSY */}
      <div className="sos-section-lbl">Malaysia Embassy · Tokyo</div>
      <div className="sos-card sos-card--embassy">
        <a className="sos-action" href="tel:+81334763840">
          <span className="sos-action-ico sos-action-ico--phone" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <span className="sos-action-main">
            <span className="sos-action-lbl">Call Embassy</span>
            <span className="sos-action-val">+81 3-3476-3840</span>
          </span>
        </a>

        <a
          className="sos-action"
          href="https://maps.google.com/?q=Embassy+of+Malaysia+Tokyo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="sos-action-ico sos-action-ico--map" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <span className="sos-action-main">
            <span className="sos-action-lbl">Address</span>
            <span className="sos-action-val">20-16 Nanpeidai-cho, Shibuya-ku, Tokyo 150-0036</span>
          </span>
        </a>

        <a className="sos-action" href="mailto:mwtokyo@kln.gov.my">
          <span className="sos-action-ico sos-action-ico--mail" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <span className="sos-action-main">
            <span className="sos-action-lbl">Email</span>
            <span className="sos-action-val">mwtokyo@kln.gov.my</span>
          </span>
        </a>
      </div>

      {/* TOURIST HELPLINE */}
      <div className="sos-section-lbl">Japan Tourist Helpline · 24/7</div>
      <div className="sos-card sos-card--helpline">
        <a className="sos-action" href="tel:+815038162787">
          <span className="sos-action-ico sos-action-ico--help" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <span className="sos-action-main">
            <span className="sos-action-lbl">Help in English / 中文</span>
            <span className="sos-action-val">050-3816-2787</span>
          </span>
        </a>
        <p className="sos-mini-tip">
          Non-emergency translation help, lost passport guidance, hospital referrals.
          Run by Japan National Tourism Organization (JNTO).
        </p>
      </div>

      {/* PHRASES SHORTCUT */}
      <div className="sos-section-lbl">Show to staff · scroll &amp; tap</div>
      <button className="sos-card sos-card--phrases sos-phrases-btn" onClick={openEmergencyPhrases}>
        <span className="sos-action-ico sos-action-ico--sos" aria-hidden="true">🆘</span>
        <span className="sos-action-main">
          <span className="sos-action-lbl">Emergency Phrases (Japanese)</span>
          <span className="sos-action-val">Help! · I&apos;m lost · Call ambulance · …</span>
        </span>
        <span className="sos-action-arrow" aria-hidden="true">›</span>
      </button>
    </div>
  );
}
