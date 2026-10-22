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
 * Prüft, ob ein gegebenes Datum (Format: 'YYYY-MM-DD') ein gesetzlicher Feiertag ist.
 * Berücksichtigt alle bundesweiten Feiertage sowie die gesetzlichen Feiertage in Schleswig-Holstein
 * (Standort von TONOYANS STUDIO in Schleswig).
 * 
 * Gibt den Namen des Feiertags zurück oder null, falls es kein Feiertag ist.
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

  // 1. Feste gesetzliche Feiertage (Bundesweit & Schleswig-Holstein)
  // Hinweis: Schleswig-Holstein hat seit 2018 auch den Reformationstag (31.10.) als gesetzlichen Feiertag.
  const fixedHolidays = {
    '01-01': 'Neujahr',
    '05-01': 'Tag der Arbeit',
    '10-03': 'Tag der Deutschen Einheit',
    '10-31': 'Reformationstag',
    '12-25': '1. Weihnachtsfeiertag',
    '12-26': '2. Weihnachtsfeiertag'
  };

  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (fixedHolidays[mmdd]) {
    return fixedHolidays[mmdd];
  }

  // 2. Bewegliche gesetzliche Feiertage (abhängig von Ostersonntag)
  const easter = getEasterSunday(year);
  const movableHolidays = {
    [formatDateISO(addDaysUTC(easter, -2))]: 'Karfreitag',
    [formatDateISO(easter)]: 'Ostersonntag',
    [formatDateISO(addDaysUTC(easter, 1))]: 'Ostermontag',
    [formatDateISO(addDaysUTC(easter, 39))]: 'Christi Himmelfahrt',
    [formatDateISO(addDaysUTC(easter, 49))]: 'Pfingstsonntag',
    [formatDateISO(addDaysUTC(easter, 50))]: 'Pfingstmontag'
  };

  const iso = `${year}-${mmdd}`;
  return movableHolidays[iso] || null;
}
