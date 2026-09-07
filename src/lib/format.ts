import { TZ } from "./constants";

export function taipeiDateISO(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Timestamp for a session on `dateISO` (YYYY-MM-DD). Today → now; past → 18:00 Taipei. */
export function sessionTimestamp(dateISO: string, now: Date = new Date()): string {
  if (dateISO === taipeiDateISO(now)) return now.toISOString();
  return `${dateISO}T18:00:00+08:00`;
}

export function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}月${d}日`;
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}年${month}月`;
}

export function weekdayLabel(iso: string): string {
  const dt = new Date(`${iso}T12:00:00+08:00`);
  return new Intl.DateTimeFormat("zh-Hant", {
    timeZone: TZ,
    weekday: "short",
  }).format(dt);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("zh-Hant", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(d);
}

export function formatKg(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds === null || totalSeconds === undefined) return "—";
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}小時${m}分`;
  if (m > 0 && sec > 0) return `${m}分${sec}秒`;
  if (m > 0) return `${m}分鐘`;
  return `${sec}秒`;
}

export function formatDistanceKm(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return "—";
  const km = meters / 1000;
  const rounded = Math.round(km * 100) / 100;
  return `${rounded} km`;
}

export function startOfWeekISO(iso: string): string {
  const dt = new Date(`${iso}T12:00:00+08:00`);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(dt);
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const offset = map[day] ?? 0;
  dt.setDate(dt.getDate() - offset);
  return taipeiDateISO(dt);
}

export function addDaysISO(iso: string, days: number): string {
  const dt = new Date(`${iso}T12:00:00+08:00`);
  dt.setDate(dt.getDate() + days);
  return taipeiDateISO(dt);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function monthGridStartOffset(year: number, month: number): number {
  const iso = `${year}-${String(month).padStart(2, "0")}-01`;
  const dt = new Date(`${iso}T12:00:00+08:00`);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(dt);
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return map[day] ?? 0;
}

export function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function epley1RM(weight: number, reps: number): number | null {
  if (weight <= 0 || reps <= 0) return null;
  if (reps === 1) return weight;
  if (reps > 12) return null;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
