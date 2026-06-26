import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'vitrox-checklist';
const CUSTOM_GROUPS_KEY = 'vitrox-checklist-custom-groups';

const CUSTOM_COLORS = [
  { color: '#b45309', iconBg: '#fef3c7' },
  { color: '#0369a1', iconBg: '#e0f2fe' },
  { color: '#7c3aed', iconBg: '#ede9fe' },
  { color: '#0d9488', iconBg: '#ccfbf1' },
  { color: '#db2777', iconBg: '#fce7f3' },
  { color: '#16a34a', iconBg: '#dcfce7' },
];

const EMOJI_OPTIONS = ['📦','🧴','👟','💊','📷','🎮','🎁','🍱','🧧','💴','🛍','🎀','🔑','📱','🧳','🎶'];

function loadCustomGroups() {
  try {
    const d = JSON.parse(localStorage.getItem(CUSTOM_GROUPS_KEY));
    if (Array.isArray(d)) return d;
  } catch {}
  return [];
}

const DEFAULT_GROUPS = [
  {
    id: 'pack',
    emoji: '🎒',
    label: 'What to Pack',    color: '#0369a1',
    iconBg: '#e0f2fe',    defaultItems: [
      { id: 'p1', text: 'Passport (valid ≥ 6 months)' },
      { id: 'p2', text: 'Yen cash (¥30,000–50,000 recommended)' },
      { id: 'p3', text: 'Phone charger' },
      { id: 'p4', text: 'Power bank' },
      { id: 'p5', text: 'Earphones' },
      { id: 'p6', text: 'Jacket / light layers' },
      { id: 'p7', text: 'Umbrella or rain jacket' },
      { id: 'p8', text: 'Medications' },
      { id: 'p9', text: 'Toiletries' },
    ],
  },
  {
    id: 'buy-my',
    emoji: '🛒',
    label: 'Buy Before Trip',
    color: '#0d9488',
    iconBg: '#ccfbf1',
    defaultItems: [
      { id: 'bm1', text: 'Yen cash (money changer)' },
      { id: 'bm2', text: 'Travel-size toiletries' },
      { id: 'bm3', text: 'Snacks for the trip' },
    ],
  },
  {
    id: 'buy-jp',
    emoji: '🗾',
    label: 'Buy in Japan',
    color: '#db2777',
    iconBg: '#fce7f3',
    defaultItems: [
      { id: 'bj1', text: 'Omiyage (regional gifts)' },
    ],
  },
  {
    id: 'buy-airport',
    emoji: '✈️',
    label: 'Buy in Airport',
    color: '#7c3aed',
    iconBg: '#ede9fe',
    defaultItems: [],
  },
];

function initState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return saved;
  } catch {}
  return Object.fromEntries(
    DEFAULT_GROUPS.map(g => [g.id, g.defaultItems.map(i => ({ ...i, checked: false }))])
  );
}

export default function Checklist() {
  const [items,      setItems]      = useState(initState);
  const [customGroups, setCustomGroups] = useState(loadCustomGroups);
  const [addingGroup,  setAddingGroup]  = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupEmoji,setNewGroupEmoji]= useState('📦');
  const [toast,      setToast]      = useState(null);
  const [addingTo,   setAddingTo]   = useState(null);
  const [addText,    setAddText]    = useState('');
  const [exitingIds,   setExitingIds]   = useState(() => new Set());
  const [enteringIds,  setEnteringIds]  = useState(() => new Set());
  const [unexitingIds, setUnexitingIds] = useState(() => new Set());
  const [unenteringIds,setUnenteringIds]= useState(() => new Set());
  const [revealedId,   setRevealedId]   = useState(null);
  const [ctxMenu,      setCtxMenu]      = useState(null);
  const toastTimer = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_GROUPS_KEY, JSON.stringify(customGroups));
  }, [customGroups]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Close context menu on any click/tap outside
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [ctxMenu]);

  function handleContextMenu(e, groupId, itemId) {
    e.preventDefault();
    setCtxMenu({ groupId, itemId, x: e.clientX, y: e.clientY });
  }

  function handleTouchStart(e, itemId) {
    if (revealedId && revealedId !== itemId) setRevealedId(null);
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e, itemId) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) setRevealedId(itemId);
      else if (revealedId === itemId) setRevealedId(null);
    }
  }

  function toggle(groupId, itemId) {
    const item = items[groupId].find(i => i.id === itemId);
    if (!item) return;

    if (!item.checked) {
      // Phase 1: fade out in place
      setExitingIds(prev => new Set([...prev, itemId]));
      setTimeout(() => {
        // Phase 2: actually check + move to bottom
        setItems(prev => ({
          ...prev,
          [groupId]: prev[groupId].map(i =>
            i.id === itemId ? { ...i, checked: true } : i
          ),
        }));
        setExitingIds(prev => { const s = new Set(prev); s.delete(itemId); return s; });
        setEnteringIds(prev => new Set([...prev, itemId]));
        // Phase 3: clear entering class after animation
        setTimeout(() => {
          setEnteringIds(prev => { const s = new Set(prev); s.delete(itemId); return s; });
        }, 400);
      }, 260);
    } else {
      // Phase 1: fade out at bottom
      setUnexitingIds(prev => new Set([...prev, itemId]));
      setTimeout(() => {
        // Phase 2: actually uncheck + move to top
        setItems(prev => ({
          ...prev,
          [groupId]: prev[groupId].map(i =>
            i.id === itemId ? { ...i, checked: false } : i
          ),
        }));
        setUnexitingIds(prev => { const s = new Set(prev); s.delete(itemId); return s; });
        setUnenteringIds(prev => new Set([...prev, itemId]));
        // Phase 3: clear unentering class after animation
        setTimeout(() => {
          setUnenteringIds(prev => { const s = new Set(prev); s.delete(itemId); return s; });
        }, 400);
      }, 260);
    }
  }

  function deleteItem(groupId, itemId) {
    const list = items[groupId];
    const idx  = list.findIndex(i => i.id === itemId);
    const item = list[idx];
    setItems(prev => ({
      ...prev,
      [groupId]: prev[groupId].filter(i => i.id !== itemId),
    }));
    clearTimeout(toastTimer.current);
    setToast({ groupId, item, idx });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  function undoDelete() {
    if (!toast) return;
    clearTimeout(toastTimer.current);
    const { groupId, item, idx } = toast;
    setItems(prev => {
      const list = [...prev[groupId]];
      list.splice(idx, 0, item);
      return { ...prev, [groupId]: list };
    });
    setToast(null);
  }

  function commitAdd(groupId) {
    const text = addText.trim();
    if (text) {
      setItems(prev => ({
        ...prev,
        [groupId]: [
          ...prev[groupId],
          { id: `${groupId}-c-${Date.now()}`, text, checked: false },
        ],
      }));
    }
    setAddText('');
    setAddingTo(null);
  }

  function cancelAdd() {
    setAddText('');
    setAddingTo(null);
  }

  function commitAddGroup() {
    const label = newGroupName.trim();
    if (!label) return;
    const idx = customGroups.length % CUSTOM_COLORS.length;
    const { color, iconBg } = CUSTOM_COLORS[idx];
    const id = `custom-${Date.now()}`;
    setCustomGroups(prev => [...prev, { id, emoji: newGroupEmoji, label, color, iconBg }]);
    setItems(prev => ({ ...prev, [id]: [] }));
    setNewGroupName('');
    setNewGroupEmoji('📦');
    setAddingGroup(false);
  }

  function deleteCustomGroup(groupId) {
    setCustomGroups(prev => prev.filter(g => g.id !== groupId));
    setItems(prev => { const next = { ...prev }; delete next[groupId]; return next; });
  }

  return (
    <>
      <div className="cl-page">
        {[...DEFAULT_GROUPS, ...customGroups].map(group => {
          const list      = items[group.id] || [];
          const atTop    = list.filter(i => (!i.checked && !unexitingIds.has(i.id)) || exitingIds.has(i.id));
          const atBottom = list.filter(i => (i.checked  && !exitingIds.has(i.id))   || unexitingIds.has(i.id));
          const sorted   = [...atTop, ...atBottom];
          const total    = list.length;
          const doneCount = list.filter(i => i.checked).length;
          const pct       = total ? (doneCount / total) * 100 : 0;

          return (
            <div key={group.id} className="cl-card" style={{ '--cl-color': group.color, '--cl-icon-bg': group.iconBg }}>
              <div className="cl-card-hdr">
                <div className="cl-icon-box">{group.emoji}</div>
                <div className="cl-card-hdr-text">
                  <span className="cl-label">{group.label}</span>
                  <span className="cl-count">{doneCount} of {total} done</span>
                </div>
                {customGroups.some(g => g.id === group.id) && (
                  <button
                    className="cl-group-del"
                    title="Delete group"
                    onClick={() => {
                      const list = items[group.id] || [];
                      if (list.length === 0 || window.confirm(`Delete "${group.label}" and all its items?`)) {
                        deleteCustomGroup(group.id);
                      }
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="cl-progress-bar">
                <div className="cl-progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <ul className="cl-list">
                {sorted.map(item => {
                  const isExiting    = exitingIds.has(item.id);
                  const isEntering   = enteringIds.has(item.id);
                  const isUnexiting  = unexitingIds.has(item.id);
                  const isUnentering = unenteringIds.has(item.id);
                  const isDone       = item.checked && !isExiting;
                  return (
                  <li
                    key={item.id}
                    className={`cl-item${isDone ? ' cl-item--done' : ''}${isExiting ? ' cl-item--exiting' : ''}${isEntering ? ' cl-item--entering' : ''}${isUnexiting ? ' cl-item--unexiting' : ''}${isUnentering ? ' cl-item--unentering' : ''}${revealedId === item.id ? ' cl-item--revealed' : ''}${ctxMenu?.itemId === item.id ? ' cl-item--ctx' : ''}`}
                    onContextMenu={e => handleContextMenu(e, group.id, item.id)}
                    onTouchStart={e => handleTouchStart(e, item.id)}
                    onTouchEnd={e => handleTouchEnd(e, item.id)}
                  >
                    <div className="cl-item-inner">
                      <button
                        className={`cl-check${isDone ? ' cl-check--checked' : ''}`}
                        onClick={() => toggle(group.id, item.id)}
                        aria-label={isDone ? 'Mark undone' : 'Mark done'}
                      />
                      <span className="cl-text">{item.text}</span>
                    </div>
                    <button
                      className="cl-del-swipe"
                      onClick={() => { deleteItem(group.id, item.id); setRevealedId(null); }}
                      aria-label="Delete item"
                    >Delete</button>
                  </li>
                  );
                })}
              </ul>

              {addingTo === group.id ? (
                <div className="cl-add-row">
                  <input
                    className="cl-add-input"
                    value={addText}
                    onChange={e => setAddText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter')  commitAdd(group.id);
                      if (e.key === 'Escape') cancelAdd();
                    }}
                    placeholder="New item..."
                    maxLength={80}
                    autoFocus
                  />
                  <button className="cl-add-confirm" onClick={() => commitAdd(group.id)}>Add</button>
                  <button className="cl-add-cancel" onClick={cancelAdd}>✕</button>
                </div>
              ) : (
                <button className="cl-add-btn" onClick={() => setAddingTo(group.id)}>
                  + Add item
                </button>
              )}
            </div>
          );
        })}
        {/* Add Group */}
        {addingGroup ? (
          <div className="cl-card cl-add-group-card">
            <div className="cl-add-group-emoji-row">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  className={`cl-emoji-btn${newGroupEmoji === e ? ' cl-emoji-btn--on' : ''}`}
                  onClick={() => setNewGroupEmoji(e)}
                >{e}</button>
              ))}
            </div>
            <div className="cl-add-group-row">
              <input
                className="cl-add-input"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitAddGroup(); if (e.key === 'Escape') setAddingGroup(false); }}
                placeholder="Group name..."
                maxLength={40}
                autoFocus
              />
              <button className="cl-add-confirm" onClick={commitAddGroup}>Add</button>
              <button className="cl-add-cancel" onClick={() => setAddingGroup(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button className="cl-add-group-btn" onClick={() => setAddingGroup(true)}>+ New Group</button>
        )}
      </div>

      {ctxMenu && (
        <div
          className="cl-ctx"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onPointerDown={e => e.stopPropagation()}
        >
          <button
            className="cl-ctx-item cl-ctx-item--danger"
            onClick={() => { deleteItem(ctxMenu.groupId, ctxMenu.itemId); setCtxMenu(null); }}
          >
            🗑 Delete item
          </button>
        </div>
      )}

      {toast && (
        <div className="cl-toast">
          <span className="cl-toast-msg">
            Removed &ldquo;{toast.item.text.length > 32 ? toast.item.text.slice(0, 32) + '…' : toast.item.text}&rdquo;
          </span>
          <button className="cl-toast-undo" onClick={undoDelete}>Undo</button>
        </div>
      )}
    </>
  );
}
