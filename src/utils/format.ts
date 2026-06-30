export function formatRuntime(minutes: number | null): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatYear(date: string): string {
  if (!date) return "";
  return date.slice(0, 4);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(date: string): string {
  if (!date) return "TBA";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatRelative(epochMs: number): string {
  const diff = Date.now() - epochMs;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(epochMs).toLocaleDateString();
}

/** Days until a date. Negative if in the past. */
export function daysUntil(date: string): number | null {
  if (!date) return null;
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

/** Human label describing a release relative to today. */
export function releaseLabel(date: string): string | null {
  const d = daysUntil(date);
  if (d === null) return null;
  if (d === 0) return "Out today";
  if (d === 1) return "Out tomorrow";
  if (d > 1 && d <= 60) return `In ${d} days`;
  if (d < 0 && d >= -30) return "Just released";
  return null;
}

export function formatVotes(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}
