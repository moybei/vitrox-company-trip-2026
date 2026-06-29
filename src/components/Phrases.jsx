import { useState, useMemo, useEffect, useRef } from 'react';
import PHRASE_GROUPS from '../data/phrases';

const ACTIVE_TAB_KEY = 'vitrox-phrases-tab';

function matchesQuery(it, q) {
  return (
    it.en.toLowerCase().includes(q) ||
    it.jp.toLowerCase().includes(q) ||
    it.romaji.toLowerCase().includes(q)
  );
}

export default function Phrases() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(ACTIVE_TAB_KEY) || 'all';
  });
  const [active, setActive] = useState(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  // Desktop: translate vertical wheel into horizontal scroll on the chip row
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  const q = query.trim().toLowerCase();

  // Per-group match counts (for auto-switch + chip badges when searching)
  const matchCounts = useMemo(() => {
    if (!q) return null;
    const counts = {};
    for (const g of PHRASE_GROUPS) {
      counts[g.id] = g.items.filter(it => matchesQuery(it, q)).length;
    }
    return counts;
  }, [q]);

  // Auto-switch: if on a specific tab with 0 matches, jump to All
  useEffect(() => {
    if (!q || !matchCounts) return;
    if (activeTab === 'all') return;
    if (matchCounts[activeTab] === 0) {
      setActiveTab('all');
    }
  }, [q, matchCounts, activeTab]);

  // Groups to render based on tab + filter
  const visibleGroups = useMemo(() => {
    const base = activeTab === 'all'
      ? PHRASE_GROUPS
      : PHRASE_GROUPS.filter(g => g.id === activeTab);

    if (!q) return base;

    return base
      .map(g => ({ ...g, items: g.items.filter(it => matchesQuery(it, q)) }))
      .filter(g => g.items.length > 0);
  }, [activeTab, q]);

  return (
    <div className="ph-page">
      <div className="ph-search-wrap">
        <input
          className="ph-search"
          type="text"
          placeholder="Search phrases…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="ph-search-clear" onClick={() => setQuery('')} aria-label="Clear">×</button>
        )}
      </div>

      <div className="ph-tabs" ref={tabsRef}>
        <button
          className={`ph-tab${activeTab === 'all' ? ' ph-tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span className="ph-tab-icon">✨</span>
          <span>All</span>
        </button>
        {PHRASE_GROUPS.map(g => {
          const isActive = activeTab === g.id;
          const count = matchCounts ? matchCounts[g.id] : null;
          const dimmed = matchCounts && count === 0;
          return (
            <button
              key={g.id}
              className={`ph-tab${isActive ? ' ph-tab--active' : ''}${dimmed ? ' ph-tab--dim' : ''}`}
              onClick={() => setActiveTab(g.id)}
              style={isActive ? { borderColor: g.color, color: g.color } : undefined}
            >
              <span className="ph-tab-icon">{g.icon}</span>
              <span>{g.label}</span>
              {count != null && count > 0 && !isActive && (
                <span className="ph-tab-badge">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="ph-hint">Tap any phrase to show big Japanese text for staff.</p>

      <div className="ph-content" key={activeTab}>
        {visibleGroups.length === 0 && (
          <div className="ph-empty">No phrases match “{query}”.</div>
        )}

        {visibleGroups.map(group => (
          <section key={group.id} className="ph-group" style={{ borderTopColor: group.color }}>
            <div className="ph-group-hdr">
              <span className="ph-group-icon" style={{ background: group.iconBg }}>{group.icon}</span>
              <span className="ph-group-label">{group.label}</span>
              <span className="ph-group-count">{group.items.length}</span>
            </div>

            <ul className="ph-list">
              {group.items.map((it, idx) => (
                <li key={idx}>
                  <button className="ph-row" onClick={() => setActive(it)}>
                    <div className="ph-row-main">
                      <div className="ph-row-en">{it.en}</div>
                      <div className="ph-row-jp">{it.jp}</div>
                      <div className="ph-row-romaji">{it.romaji}</div>
                    </div>
                    <span className="ph-row-show" aria-hidden="true">🔍</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {active && (
        <div className="ph-modal" onClick={() => setActive(null)}>
          <div className="ph-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="ph-modal-close" onClick={() => setActive(null)} aria-label="Close">×</button>
            <div className="ph-modal-en">{active.en}</div>
            <div className="ph-modal-jp">{active.jp}</div>
            <div className="ph-modal-romaji">{active.romaji}</div>
            <div className="ph-modal-tip">Show this screen to staff</div>
          </div>
        </div>
      )}
    </div>
  );
}
