export const FLIGHTS = {
  cathay: {
    airline: 'Cathay Pacific',
    code: 'CX',
    color: '#006564',
    bgColor: '#e6f4f4',
    baggage: '23 kg',
    outbound: [
      { flight: 'CX 622', route: 'PEN → HKG', dep: '07:30', arr: '11:30', duration: '4h' },
      { flight: 'Layover', route: 'Connection at Hong Kong', dep: '', arr: '', duration: '3h 50m', layover: true },
      { flight: 'CX 500', route: 'HKG → NRT', dep: '15:20', arr: '20:50', duration: '4h 30m' },
    ],
    inbound: [
      { flight: 'CX 509', route: 'NRT → HKG', dep: '09:25', arr: '13:15', duration: '4h 50m' },
      { flight: 'Layover', route: 'Connection at Hong Kong', dep: '', arr: '', duration: '2h', layover: true },
      { flight: 'CX 621', route: 'HKG → PEN', dep: '15:30', arr: '19:10', duration: '3h 40m' },
    ],
    totalTime: '~22h',
  },
  sq: {
    airline: 'Singapore Airlines',
    code: 'SQ',
    color: '#1b4f8a',
    bgColor: '#e8eef6',
    baggage: '25 kg',
    outbound: [
      { flight: 'SQ 131', route: 'PEN → SIN', dep: '10:15', arr: '11:45', duration: '1h 30m' },
      { flight: 'Layover', route: 'Connection at Singapore', dep: '', arr: '', duration: '55m', layover: true },
      { flight: 'SQ 634', route: 'SIN → HND', dep: '13:55', arr: '21:55', duration: '7h 15m' },
    ],
    inbound: [
      { flight: 'SQ 637', route: 'NRT → SIN', dep: '10:55', arr: '16:55', duration: '7h' },
      { flight: 'Layover', route: 'Connection at Singapore', dep: '', arr: '', duration: '2h 15m', layover: true },
      { flight: 'SQ 142', route: 'SIN → PEN', dep: '19:10', arr: '20:35', duration: '1h 25m' },
    ],
    totalTime: '~20h 20m',
  },
};
