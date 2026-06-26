import { useState, useLayoutEffect, useEffect } from 'react';

const LS_KEY = 'vitrox-fx-rate';

export function useExchangeRate() {
  const [rate,      setRate]      = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [fetching,  setFetching]  = useState(false);

  // Restore from localStorage synchronously before paint
  useLayoutEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(LS_KEY));
      if (cached?.myrToJpy) {
        setRate(cached.myrToJpy);
        setUpdatedAt(cached.updatedAt);
      }
    } catch { /* ignore */ }
  }, []);

  // Background fetch — updates instantly when done
  useEffect(() => {
    setFetching(true);
    fetch('https://open.er-api.com/v6/latest/MYR')
      .then((r) => r.json())
      .then((data) => {
        if (data.result === 'success' && data.rates?.JPY) {
          const myrToJpy  = data.rates.JPY;
          const updatedAt = new Date().toISOString();
          setRate(myrToJpy);
          setUpdatedAt(updatedAt);
          localStorage.setItem(LS_KEY, JSON.stringify({ myrToJpy, updatedAt }));
        }
      })
      .catch(() => { /* use cached on error */ })
      .finally(() => setFetching(false));
  }, []);

  return { rate, updatedAt, fetching };
}
