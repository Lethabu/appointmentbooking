// src/lib/scheduling.ts
export type BookingWindow = { start: Date; end: Date };

export function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

/**
 * isConflict - checks whether a new booking (start, end) overlaps any existing bookings
 * existing: array of { start: Date, end: Date } (booking windows)
 * newStart/newEnd: Date | string
 */
export function isConflict(existing: BookingWindow[], newStart: string | Date, newEnd: string | Date): boolean {
  const s = toDate(newStart).getTime();
  const e = toDate(newEnd).getTime();
  if (e <= s) return true; // invalid interval -> treat as conflict

  for (const b of existing) {
    const bs = toDate(b.start).getTime();
    const be = toDate(b.end).getTime();
    // overlap if not (be <= s OR bs >= e)
    if (!(be <= s || bs >= e)) return true;
  }
  return false;
}

/**
 * computeEndTime - helper to compute end time given a start and duration (minutes)
 */
export function computeEndTime(start: string | Date, durationMinutes: number): Date {
  const s = toDate(start);
  return new Date(s.getTime() + durationMinutes * 60 * 1000);
}