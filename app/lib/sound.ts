"use client";

// Ultra-light sound via Web Audio osc — no file needed, zero bundle.
// Respects prefers-reduced-motion / user mute.

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    return ctx;
  } catch { return null; }
}

const MUTE_KEY = "herobook_sound_muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch { return false; }
}

export function setMuted(muted: boolean) {
  try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch {}
  try { window.dispatchEvent(new Event("herobook_sound_toggled")); } catch {}
}

export function playTone(freq: number, durationMs: number, type: OscillatorType = "sine", gain = 0.12) {
  if (isMuted()) return;
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") audio.resume().catch(() => {});
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(audio.destination);
  const now = audio.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function sfxPageTurn() {
  playTone(520, 90, "triangle", 0.10);
  setTimeout(() => playTone(760, 70, "sine", 0.08), 55);
}

export function sfxCoin() {
  playTone(880, 90, "sine", 0.14);
  setTimeout(() => playTone(1108, 110, "sine", 0.10), 80);
}

export function sfxSuccess() {
  playTone(640, 100, "sine", 0.13);
  setTimeout(() => playTone(820, 110, "sine", 0.13), 110);
  setTimeout(() => playTone(1020, 160, "sine", 0.11), 240);
}

export function sfxDeath() {
  playTone(220, 260, "sawtooth", 0.06);
  setTimeout(() => playTone(150, 320, "triangle", 0.07), 120);
}

export function sfxChoice() {
  playTone(420, 70, "sine", 0.09);
}
