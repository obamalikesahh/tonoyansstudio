/**
 * Berechnet das genaue Datum des Ostersonntags für ein gegebenes Jahr (Gregorianischer Kalender).
 * Verwendet den Meeus/Jones/Butcher-Algorithmus.
 */
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateISO(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysUTC(d, days) {
  const res = new Date(d.getTime());
  res.setUTCDate(res.getUTCDate() + days);
  return res;
}

/**
 * Berechnet den Buß- und Bettag (Mittwoch vor dem 23. November).
 */
function getBussUndBettagISO(year) {
  const d = new Date(Date.UTC(year, 10, 22)); // 22. November
  const day = d.getUTCDay(); // 0 = Sonntag, 3 = Mittwoch
  const diff = (day - 3 + 7) % 7;
  d.setUTCDate(22 - diff);
  return formatDateISO(d);
}

/**
 * Prüft, ob ein gegebenes Datum (Format: 'YYYY-MM-DD') ein Feiertag, Heiligabend oder Silvester ist.
 * Beinhaltet:
 * - Alle bundesweiten gesetzlichen Feiertage
 * - Feiertage der Bundesländer (Reformationstag, Allerheiligen, Heilige Drei Könige, Fronleichnam, etc.)
 * - Heiligabend (24.12.) und Silvester (31.12.)
 * 
 * Gibt den Namen des Feiertags zurück oder null, falls geöffnet/regulärer Tag.
 * 
 * @param {string} dateStr - Datum im Format 'YYYY-MM-DD'
 * @returns {string|null} - Name des Feiertags oder null
 */
export function getPublicHoliday(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-').map(Number);
  if (parts.length !== 3) return null;
  const [year, month, day] = parts;
  if (!year || !month || !day) return null;

  // 1. Feste Feiertage & Schließtage
  const fixedHolidays = {
    '01-01': 'Neujahr',
    '01-06': 'Heilige Drei Könige',
    '03-08': 'Internationaler Frauentag',
    '05-01': 'Tag der Arbeit',
    '08-15': 'Mariä Himmelfahrt',
    '09-20': 'Weltkindertag',
    '10-03': 'Tag der Deutschen Einheit',
    '10-31': 'Reformationstag',
    '11-01': 'Allerheiligen',
    '12-24': 'Heiligabend',
    '12-25': '1. Weihnachtsfeiertag',
    '12-26': '2. Weihnachtsfeiertag',
    '12-31': 'Silvester'
  };

  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (fixedHolidays[mmdd]) {
    return fixedHolidays[mmdd];
  }

  // 2. Bewegliche Feiertage (abhängig von Ostersonntag)
  const easter = getEasterSunday(year);
  const movableHolidays = {
    [formatDateISO(addDaysUTC(easter, -2))]: 'Karfreitag',
    [formatDateISO(easter)]: 'Ostersonntag',
    [formatDateISO(addDaysUTC(easter, 1))]: 'Ostermontag',
    [formatDateISO(addDaysUTC(easter, 39))]: 'Christi Himmelfahrt',
    [formatDateISO(addDaysUTC(easter, 49))]: 'Pfingstsonntag',
    [formatDateISO(addDaysUTC(easter, 50))]: 'Pfingstmontag',
    [formatDateISO(addDaysUTC(easter, 60))]: 'Fronleichnam',
    [getBussUndBettagISO(year)]: 'Buß- und Bettag'
  };

  const iso = `${year}-${mmdd}`;
  return movableHolidays[iso] || null;
}
