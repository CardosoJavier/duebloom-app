/**
 * Date utility functions.
 * All functions are pure with no side effects.
 */

/**
 * Converts a Date to a local YYYY-MM-DD string, avoiding UTC off-by-one.
 * Use this instead of date.toISOString().split('T')[0].
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Alias for toLocalDateString — used in streak/calendar contexts.
 */
export const toDateKey = toLocalDateString;

/** Returns today's date as a YYYY-MM-DD string in local time. */
export function getTodayKey(): string {
  return toLocalDateString(new Date());
}

/** Returns yesterday's date as a YYYY-MM-DD string in local time. */
export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateString(d);
}

/**
 * Parses a YYYY-MM-DD string to a Date at midnight local time.
 * Avoids the UTC off-by-one that new Date('YYYY-MM-DD') causes.
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns the number of whole days between two dates (b - a).
 * Positive result means b is after a.
 */
export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bDay.getTime() - aDay.getTime()) / msPerDay);
}

/**
 * Returns the first and last moment of the month that contains the given date.
 */
export function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end };
}

/** Returns the number of days in the month that contains the given date. */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Returns true when two dates fall in the same calendar month. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
