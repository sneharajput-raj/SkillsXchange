// Date/time and number formatting helpers.

/**
 * Format an ISO-8601/Instant string into a readable date.
 * Backend returns Instant fields (e.g. "2026-09-25T14:30:00Z").
 */
export function formatDate(iso, options = {}) {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  // LocalTime comes as "17:00:00" or "17:00"
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const minute = m || '00';
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute} ${period}`;
  } catch {
    return timeStr;
  }
}

export function timeAgo(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function formatNumber(value) {
  if (value == null) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatRating(value) {
  if (value == null) return 'N/A';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(num)) return 'N/A';
  return num.toFixed(1);
}

export function formatMonthLabel(months) {
  if (months == null) return '';
  if (months < 1) return '< 1 month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return years === 1 ? '1 year' : `${years} years`;
  return `${years}y ${rem}m`;
}

export function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function getInitials(name) {
  return initials(name);
}
