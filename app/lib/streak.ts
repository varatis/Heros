"use client";

// Braise Kaï — streak localStorage first, puis Supabase quand dispo.
// Clé: herobook_streak  { current, best, lastDate, freezes, updatedAt }

export interface StreakData {
  current: number;
  best: number;
  lastDate: string | null; // YYYY-MM-DD
  freezes: number; // talismans disponibles
  updatedAt: string;
}

const KEY = "herobook_streak";
const FREEZES_DEFAULT = 1;

function todayISO(): string {
  const d = new Date();
  // Use local date, not UTC, for habit
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T12:00:00");
  const db = new Date(b + "T12:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function getStreak(): StreakData {
  if (typeof window === "undefined") {
    return { current: 0, best: 0, lastDate: null, freezes: FREEZES_DEFAULT, updatedAt: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { current: 0, best: 0, lastDate: null, freezes: FREEZES_DEFAULT, updatedAt: new Date().toISOString() };
    const parsed = JSON.parse(raw) as StreakData;
    return {
      current: parsed.current ?? 0,
      best: parsed.best ?? 0,
      lastDate: parsed.lastDate ?? null,
      freezes: parsed.freezes ?? FREEZES_DEFAULT,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return { current: 0, best: 0, lastDate: null, freezes: FREEZES_DEFAULT, updatedAt: new Date().toISOString() };
  }
}

export function saveStreak(data: StreakData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("herobook_streak_updated", { detail: data }));
}

export function isAtRisk(streak: StreakData): boolean {
  if (!streak.lastDate) return false;
  const today = todayISO();
  if (streak.lastDate === today) return false;
  const diff = daysBetween(streak.lastDate, today);
  // If 1 day gap = at risk tonight, >1 = already broken
  return diff === 1;
}

export function isBroken(streak: StreakData): boolean {
  if (!streak.lastDate) return false;
  const today = todayISO();
  if (streak.lastDate === today) return false;
  return daysBetween(streak.lastDate, today) > 1;
}

/** Call when user reads a paragraph / validates a choice */
export function markReadingDone(): StreakData {
  const s = getStreak();
  const today = todayISO();

  if (s.lastDate === today) {
    return s; // already done today
  }

  if (!s.lastDate) {
    const next = { current: 1, best: 1, lastDate: today, freezes: s.freezes, updatedAt: new Date().toISOString() };
    saveStreak(next);
    return next;
  }

  const diff = daysBetween(s.lastDate, today);
  if (diff === 1) {
    // consecutive
    const current = s.current + 1;
    const best = Math.max(s.best, current);
    const next = { current, best, lastDate: today, freezes: s.freezes, updatedAt: new Date().toISOString() };
    saveStreak(next);
    return next;
  }
  if (diff > 1) {
    // broken — use freeze if available? Auto-consume one
    if (s.freezes > 0) {
      const freezes = s.freezes - 1;
      const current = s.current + 1; // freeze saves it
      const best = Math.max(s.best, current);
      const next = { current, best, lastDate: today, freezes, updatedAt: new Date().toISOString() };
      saveStreak(next);
      return next;
    }
    const next = { current: 1, best: s.best, lastDate: today, freezes: s.freezes, updatedAt: new Date().toISOString() };
    saveStreak(next);
    return next;
  }
  // diff <=0 (same day or future) — ignore
  return s;
}

export function addFreeze(n = 1) {
  const s = getStreak();
  const next = { ...s, freezes: s.freezes + n, updatedAt: new Date().toISOString() };
  saveStreak(next);
  return next;
}

export function useStreakSync(callback: (s: StreakData) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(getStreak());
  window.addEventListener("herobook_streak_updated", handler as EventListener);
  window.addEventListener("storage", handler as EventListener);
  return () => {
    window.removeEventListener("herobook_streak_updated", handler as EventListener);
    window.removeEventListener("storage", handler as EventListener);
  };
}
