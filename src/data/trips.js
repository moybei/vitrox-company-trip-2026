// Trip batches with start dates
export const TRIPS = [
  { id:  1, start: '2026-08-15' }, { id:  2, start: '2026-08-22' },
  { id:  3, start: '2026-08-22' }, { id:  4, start: '2026-08-29' },
  { id:  5, start: '2026-09-01' }, { id:  6, start: '2026-09-02' },
  { id:  7, start: '2026-09-03' }, { id:  8, start: '2026-09-05' },
  { id:  9, start: '2026-09-05' }, { id: 10, start: '2026-09-06' },
  { id: 11, start: '2026-09-07' }, { id: 12, start: '2026-09-08' },
  { id: 13, start: '2026-09-15' }, { id: 14, start: '2026-09-16' },
  { id: 15, start: '2026-09-17' }, { id: 16, start: '2026-09-18' },
  { id: 17, start: '2026-09-19' }, { id: 18, start: '2026-09-19' },
  { id: 19, start: '2026-09-20' }, { id: 20, start: '2026-09-29' },
  { id: 21, start: '2026-09-30' }, { id: 22, start: '2026-10-03' },
  { id: 23, start: '2026-10-04' }, { id: 24, start: '2026-10-08' },
  { id: 25, start: '2026-10-14' }, { id: 26, start: '2026-10-21' },
  { id: 27, start: '2026-10-27' }, { id: 28, start: '2026-10-28' },
  { id: 29, start: '2026-10-29' }, { id: 30, start: '2026-10-31' },
  { id: 31, start: '2026-11-17' }, { id: 32, start: '2026-11-21' },
];

// Trips flying with Cathay Pacific
export const CATHAY_TRIPS = new Set([1, 2, 3, 4, 8, 9, 18, 22, 30, 32]);

// Trips flying with Singapore Airlines
export const SQ_TRIPS = new Set([5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 31]);

export function getAirline(tripId) {
  if (CATHAY_TRIPS.has(tripId)) return 'cathay';
  if (SQ_TRIPS.has(tripId))     return 'sq';
  return null;
}

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function fmtDate(date) {
  return `${String(date.getDate()).padStart(2,'0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
export function fmtWeekday(date) { return DAYS[date.getDay()]; }
