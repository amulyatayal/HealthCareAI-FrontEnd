export function formatStartsAt(startsAt: string): string {
  try {
    const d = new Date(startsAt);
    return (
      d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) +
      ' at ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    );
  } catch {
    return startsAt;
  }
}

export function formatEventCalendarParts(startsAt: string): { day: string; month: string } {
  try {
    const d = new Date(startsAt);
    return {
      day: String(d.getDate()),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  } catch {
    return { day: '--', month: '---' };
  }
}

export function formatEventTime(startsAt: string): string {
  try {
    return new Date(startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return startsAt;
  }
}

export function getEventDaysInMonth(
  events: { starts_at: string }[],
  year: number,
  month: number
): number[] {
  const days = new Set<number>();
  for (const event of events) {
    const d = new Date(event.starts_at);
    if (d.getFullYear() === year && d.getMonth() === month) {
      days.add(d.getDate());
    }
  }
  return [...days].sort((a, b) => a - b);
}
