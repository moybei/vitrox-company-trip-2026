import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'vitrox-splitter';

function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && d.members) return { transfers: [], ...d };
  } catch {}
  return { members: [], expenses: [], transfers: [] };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fmtAmt(amount, currency) {
  if (currency === 'JPY') return `¥${Math.round(amount).toLocaleString()}`;
  return `RM ${Math.abs(amount).toFixed(2)}`;
}

// Net balance per member per currency
// Positive = others owe you, Negative = you owe others
function calcBalances(members, expenses, transfers = []) {
  const bal = {};
  members.forEach(m => { bal[m.id] = { JPY: 0, MYR: 0 }; });

  expenses.forEach(exp => {
    const n = exp.splitWith.length;
    if (!n) return;
    const share = exp.amount / n;
    const cur = exp.currency;
    if (bal[exp.paidBy] !== undefined) {
      bal[exp.paidBy][cur] += exp.amount - share;
    }
    exp.splitWith.forEach(id => {
      if (id !== exp.paidBy && bal[id] !== undefined) {
        bal[id][cur] -= share;
      }
    });
  });

  // Apply settlements: from pays to, reduces debt on both sides
  transfers.forEach(t => {
    if (bal[t.from] !== undefined) bal[t.from][t.currency] += t.amount;
    if (bal[t.to]   !== undefined) bal[t.to][t.currency]   -= t.amount;
  });

  return bal;
}

// Greedy minimum-transactions settlement
function calcSettlements(members, expenses, transfers = []) {
  const results = [];
  ['JPY', 'MYR'].forEach(cur => {
    const bal = {};
    members.forEach(m => { bal[m.id] = 0; });

    expenses.filter(e => e.currency === cur).forEach(exp => {
      const n = exp.splitWith.length;
      if (!n) return;
      const share = exp.amount / n;
      if (bal[exp.paidBy] !== undefined) bal[exp.paidBy] += exp.amount - share;
      exp.splitWith.forEach(id => {
        if (id !== exp.paidBy && bal[id] !== undefined) bal[id] -= share;
      });
    });

    transfers.filter(t => t.currency === cur).forEach(t => {
      if (bal[t.from] !== undefined) bal[t.from] += t.amount;
      if (bal[t.to]   !== undefined) bal[t.to]   -= t.amount;
    });

    const debtors  = members.filter(m => bal[m.id] < -0.01).map(m => ({ ...m, b: bal[m.id] })).sort((a, b) => a.b - b.b);
    const creditors = members.filter(m => bal[m.id] >  0.01).map(m => ({ ...m, b: bal[m.id] })).sort((a, b) => b.b - a.b);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(Math.abs(debtors[i].b), creditors[j].b);
      results.push({ from: debtors[i].name, to: creditors[j].name, amount: transfer, currency: cur });
      debtors[i].b  += transfer;
      creditors[j].b -= transfer;
      if (Math.abs(debtors[i].b)  < 0.01) i++;
      if (Math.abs(creditors[j].b) < 0.01) j++;
    }
  });
  return results;
}

const BLANK_FORM = { desc: '', amount: '', currency: 'JPY', paidBy: '', splitWith: [] };

export default function Splitter() {
  const [data,      setData]      = useState(loadData);
  const [view,      setView]      = useState('expenses');
  const [showAdd,          setShowAdd]          = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [form,      setForm]      = useState(BLANK_FORM);

  const [revealedId,   setRevealedId]   = useState(null);
  const [ctxMenu,       setCtxMenu]       = useState(null);
  const [settlingKeys,  setSettlingKeys]  = useState(new Set());
  const touchStart = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Close context menu on outside click
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [ctxMenu]);

  function handleContextMenu(e, id) {
    e.preventDefault();
    setCtxMenu({ id, x: e.clientX, y: e.clientY });
  }

  function handleTouchStart(e, id) {
    if (revealedId && revealedId !== id) setRevealedId(null);
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e, id) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) setRevealedId(id);
      else if (revealedId === id) setRevealedId(null);
    }
  }

  /* ── Members ── */
  function addMember() {
    const name = newMember.trim();
    if (!name || data.members.some(m => m.name.toLowerCase() === name.toLowerCase())) return;
    setData(d => ({ ...d, members: [...d.members, { id: uid(), name }] }));
    setNewMember('');
  }

  function removeMember(id) {
    setData(d => ({
      ...d,
      members: d.members.filter(m => m.id !== id),
    }));
  }

  /* ── Expenses ── */
  function openAdd() {
    const all = data.members.map(m => m.id);
    setForm({ desc: '', amount: '', currency: 'JPY', paidBy: data.members[0]?.id || '', splitWith: all });
    setShowAdd(true);
  }

  function toggleSplit(id) {
    setForm(f => ({
      ...f,
      splitWith: f.splitWith.includes(id) ? f.splitWith.filter(x => x !== id) : [...f.splitWith, id],
    }));
  }

  function submitAdd() {
    const amount = parseFloat(form.amount);
    if (!form.desc.trim() || isNaN(amount) || amount <= 0 || !form.paidBy) return;
    // Always include payer in split
    const splitWith = form.splitWith.includes(form.paidBy)
      ? form.splitWith
      : [form.paidBy, ...form.splitWith];
    if (splitWith.length === 0) return;

    setData(d => ({
      ...d,
      expenses: [...d.expenses, {
        id: uid(),
        desc: form.desc.trim(),
        amount,
        currency: form.currency,
        paidBy: form.paidBy,
        splitWith,
        date: new Date().toISOString().slice(0, 10),
      }],
    }));
    setShowAdd(false);
  }

  function deleteExpense(id) {
    setData(d => ({ ...d, expenses: d.expenses.filter(e => e.id !== id) }));
  }

  const { members, expenses, transfers = [] } = data;
  const balances    = calcBalances(members, expenses, transfers);
  const settlements = calcSettlements(members, expenses, transfers);

  // per-split preview amount
  const previewN = form.splitWith.includes(form.paidBy)
    ? form.splitWith.length
    : form.splitWith.length + 1;
  const previewAmt = parseFloat(form.amount);

  return (
    <div className="sp-page">

      {/* ── Members bar ── */}
      <div className="sp-members-bar">
        <div className="sp-members-label">Group members</div>
        <div className="sp-members-list">
          {members.map(m => {
            const hasActivity = expenses.some(e => e.paidBy === m.id || e.splitWith.includes(m.id))
                             || transfers.some(t => t.from === m.id || t.to === m.id);
            return (
              <span key={m.id} className={`sp-chip${hasActivity ? ' sp-chip--locked' : ''}`}>
                {m.name}
                <button
                  className="sp-chip-del"
                  disabled={hasActivity}
                  title={hasActivity ? 'Cannot remove a member involved in expenses or transfers' : undefined}
                  onClick={() => removeMember(m.id)}
                >×</button>
              </span>
            );
          })}
          {members.length === 0 && <span className="sp-members-empty">No members yet</span>}
        </div>
        <div className="sp-member-add">
          <input
            className="sp-member-input"
            value={newMember}
            onChange={e => setNewMember(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMember()}
            placeholder="Add member name..."
            maxLength={30}
          />
          <button className="sp-member-btn" onClick={addMember}>Add</button>
        </div>
      </div>

      {/* ── View tabs ── */}
      <div className="sp-tabs">
        <button className={`sp-tab${view === 'expenses' ? ' sp-tab--active' : ''}`} onClick={() => setView('expenses')}>
          💸 Expenses
        </button>
        <button className={`sp-tab${view === 'settle' ? ' sp-tab--active' : ''}`} onClick={() => setView('settle')}>
          ⚖️ Settle Up
        </button>
      </div>

      {/* ── Expenses view ── */}
      {view === 'expenses' && (
        <div className="sp-list">
          {expenses.length === 0 && (
            <div className="sp-empty">No expenses recorded yet.</div>
          )}
          {expenses.map(exp => {
            const payer      = members.find(m => m.id === exp.paidBy);
            const splitNames = exp.splitWith.map(id => members.find(m => m.id === id)?.name).filter(Boolean);
            const share      = fmtAmt(exp.amount / exp.splitWith.length, exp.currency);
            return (
              <div
                key={exp.id}
                className={`sp-card${revealedId === exp.id ? ' sp-card--revealed' : ''}${ctxMenu?.id === exp.id ? ' sp-card--ctx' : ''}`}
                onContextMenu={e => handleContextMenu(e, exp.id)}
                onTouchStart={e => handleTouchStart(e, exp.id)}
                onTouchEnd={e => handleTouchEnd(e, exp.id)}
              >
                <div className="sp-card-inner">
                  <div className="sp-card-row">
                    <span className="sp-card-desc">{exp.desc}</span>
                    <span className="sp-card-amt">{fmtAmt(exp.amount, exp.currency)}</span>
                  </div>
                  <div className="sp-card-meta">
                    <span>Paid by <strong>{payer?.name ?? '?'}</strong></span>
                    <span className="sp-dot">·</span>
                    <span>{share} each</span>
                    <span className="sp-dot">·</span>
                    <span>{exp.date}</span>
                  </div>
                  <div className="sp-card-split">{splitNames.join(', ')}</div>
                </div>
                <button
                  className="sp-card-del-swipe"
                  onClick={() => { deleteExpense(exp.id); setRevealedId(null); }}
                >Delete</button>
              </div>
            );
          })}

          {members.length >= 2 ? (
            <button className="sp-add-btn" onClick={openAdd}>+ Add Expense</button>
          ) : (
            <div className="sp-hint">Add at least 2 members to start recording expenses.</div>
          )}
        </div>
      )}

      {/* ── Settle Up view ── */}
      {view === 'settle' && (
        <div className="sp-settle">

          {/* Per-person balance */}
          <div className="sp-balances">
            {members.length === 0 && <div className="sp-empty">No members yet.</div>}
            {members.map(m => {
              const b = balances[m.id] || { JPY: 0, MYR: 0 };
              const hasJPY = Math.abs(b.JPY) > 0.5;
              const hasMYR = Math.abs(b.MYR) > 0.01;
              return (
                <div key={m.id} className="sp-bal-row">
                  <span className="sp-bal-name">{m.name}</span>
                  <div className="sp-bal-amounts">
                    {hasJPY && (
                      <span className={b.JPY >= 0 ? 'sp-bal-pos' : 'sp-bal-neg'}>
                        {b.JPY > 0 ? '+' : ''}{fmtAmt(b.JPY, 'JPY')}
                      </span>
                    )}
                    {hasMYR && (
                      <span className={b.MYR >= 0 ? 'sp-bal-pos' : 'sp-bal-neg'}>
                        {b.MYR > 0 ? '+' : '-'}{fmtAmt(b.MYR, 'MYR')}
                      </span>
                    )}
                    {!hasJPY && !hasMYR && <span className="sp-bal-even">Settled ✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settlements */}
          {settlements.length > 0 && (
            <div className="sp-settlements">
              <div className="sp-settle-hdr">Suggested payments</div>
              {settlements.map((s, i) => {
                const sKey = `${s.from}→${s.to}:${s.currency}`;
                const isSettling = settlingKeys.has(sKey);
                return (
                  <div
                    key={i}
                    className={`sp-settle-row${isSettling ? ' sp-settle-row--settling' : ''}`}
                    onAnimationEnd={() => {
                      if (!isSettling) return;
                      const fromId = members.find(m => m.name === s.from)?.id;
                      const toId   = members.find(m => m.name === s.to)?.id;
                      if (fromId && toId) {
                        setData(d => ({
                          ...d,
                          transfers: [...(d.transfers || []), {
                            id: uid(), from: fromId, to: toId,
                            amount: s.amount, currency: s.currency,
                            date: new Date().toISOString().slice(0, 10),
                          }],
                        }));
                      }
                      setSettlingKeys(prev => { const next = new Set(prev); next.delete(sKey); return next; });
                    }}
                  >
                    <span className="sp-settle-from">{s.from}</span>
                    <span className="sp-settle-arrow">pays</span>
                    <span className="sp-settle-to">{s.to}</span>
                    <span className="sp-settle-amt">{fmtAmt(s.amount, s.currency)}</span>
                    <button
                      className={`sp-settle-btn${isSettling ? ' sp-settle-btn--done' : ''}`}
                      disabled={isSettling}
                      onClick={() => {
                        setSettlingKeys(prev => new Set(prev).add(sKey));
                      }}
                    >{isSettling ? '✓ Done!' : 'Settle ✓'}</button>
                  </div>
                );
              })}
            </div>
          )}
          {settlements.length === 0 && members.length > 0 && expenses.length > 0 && (
            <div className="sp-all-settled">
              <div>🎉 Everyone is settled!</div>
              {!showClearConfirm ? (
                <button className="sp-clear-btn" onClick={() => setShowClearConfirm(true)}>🗑 Clear all expenses</button>
              ) : (
                <div className="sp-clear-confirm">
                  <span>Clear all expenses &amp; transfers?</span>
                  <div className="sp-clear-confirm-btns">
                    <button className="sp-clear-confirm-yes" onClick={() => {
                      setData(d => ({ ...d, expenses: [], transfers: [] }));
                      setShowClearConfirm(false);
                    }}>Yes, clear</button>
                    <button className="sp-clear-confirm-no" onClick={() => setShowClearConfirm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {ctxMenu && (
        <div
          className="cl-ctx"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onPointerDown={e => e.stopPropagation()}
        >
          <button
            className="cl-ctx-item cl-ctx-item--danger"
            onClick={() => { deleteExpense(ctxMenu.id); setCtxMenu(null); }}
          >
            🗑 Delete expense
          </button>
        </div>
      )}

      {/* ── Add Expense modal ── */}
      {showAdd && (
        <>
          <div className="sp-overlay" onClick={() => setShowAdd(false)} />
          <div className="sp-modal">
            <div className="sp-modal-hdr">
              <span className="sp-modal-title">Add Expense</span>
              <button className="sp-modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>

            <div className="sp-field">
              <span className="sp-field-lbl">Description</span>
              <input
                className="sp-field-input"
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="e.g. Ramen lunch"
                maxLength={60}
                autoFocus
              />
            </div>

            <div className="sp-field">
              <span className="sp-field-lbl">Amount</span>
              <div className="sp-amount-row">
                <input
                  className="sp-field-input sp-amount-input"
                  type="text"
                  inputMode="decimal"
                  min="0"
                  step={form.currency === 'JPY' ? '1' : '0.01'}
                  value={form.amount}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) setForm(f => ({ ...f, amount: val }));
                  }}
                  placeholder="0"
                />
                <div className="sp-cur-toggle">
                  <button
                    className={`sp-cur-btn${form.currency === 'JPY' ? ' sp-cur-btn--on' : ''}`}
                    onClick={() => setForm(f => ({ ...f, currency: 'JPY' }))}
                  >JPY</button>
                  <button
                    className={`sp-cur-btn${form.currency === 'MYR' ? ' sp-cur-btn--on' : ''}`}
                    onClick={() => setForm(f => ({ ...f, currency: 'MYR' }))}
                  >MYR</button>
                </div>
              </div>
            </div>

            <div className="sp-field">
              <span className="sp-field-lbl">Paid by</span>
              <select
                className="sp-field-select"
                value={form.paidBy}
                onChange={e => setForm(f => ({ ...f, paidBy: e.target.value }))}
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="sp-field">
              <span className="sp-field-lbl">Split with</span>
              <div className="sp-split-list">
                {members.map(m => (
                  <label key={m.id} className="sp-split-item">
                    <input
                      type="checkbox"
                      checked={form.splitWith.includes(m.id) || m.id === form.paidBy}
                      disabled={m.id === form.paidBy}
                      onChange={() => toggleSplit(m.id)}
                    />
                    <span>{m.name}{m.id === form.paidBy ? ' (payer)' : ''}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.amount && !isNaN(previewAmt) && previewAmt > 0 && previewN > 0 && (
              <div className="sp-preview">
                Each pays {fmtAmt(previewAmt / previewN, form.currency)}
                {' '}({previewN} {previewN === 1 ? 'person' : 'people'})
              </div>
            )}

            <div className="sp-modal-footer">
              <button className="sp-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="sp-btn-confirm" onClick={submitAdd}>Add Expense</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
