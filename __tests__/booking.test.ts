import { isConflict } from '../src/lib/scheduling';

test('detects overlapping booking', () => {
  const existing = [{ start: new Date('2025-10-20T10:00:00Z'), end: new Date('2025-10-20T11:00:00Z') }];
  const conflict = isConflict(existing, new Date('2025-10-20T10:30:00Z'), new Date('2025-10-20T11:30:00Z'));
  expect(conflict).toBe(true);
});