function asDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDateDisplay(value: Date | string): string {
  return asDate(value).toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  });
}

export function formatDateRangeDisplay(start: Date | string, end: Date | string): string {
  return `${formatDateDisplay(start)} - ${formatDateDisplay(end)}`;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0m';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export function formatMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return '0m';
  }

  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
