"use client";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { isMuted, setMuted } from "@/lib/sound";
import type { ReadingPreferences } from "@/lib/lonewolf/reading-preferences";
export default function ReadingSettings({
  value,
  onChange,
}: {
  value: ReadingPreferences;
  onChange: (p: ReadingPreferences) => void;
}) {
  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Ambiance de lecture</legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              {
                id: "paper",
                name: "Parchemin",
                colors: "bg-[#f6f0e3] text-[#28291f]",
              },
              { id: "light", name: "Clair", colors: "bg-white text-slate-900" },
              {
                id: "night",
                name: "Nuit",
                colors: "bg-[#202923] text-[#eeeade]",
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              aria-pressed={value.theme === t.id}
              onClick={() => onChange({ ...value, theme: t.id })}
              className={`rounded-xl p-3 min-h-20 border-2 ${value.theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-transparent"} ${t.colors}`}
            >
              <span className="block font-serif text-2xl mb-2">Aa</span>
              <span className="text-xs font-semibold">{t.name}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Taille du texte</legend>
        <div className="grid grid-cols-3 gap-2">
          {([18, 20, 22] as const).map((size, i) => (
            <button
              key={size}
              aria-pressed={value.fontSize === size}
              onClick={() => onChange({ ...value, fontSize: size })}
              className={`min-h-12 rounded-lg border text-sm ${value.fontSize === size ? "border-primary text-primary bg-primary/10" : "border-border"}`}
            >
              {["Standard", "Confort", "Grand"][i]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center justify-between gap-3 min-h-12 cursor-pointer text-sm">
        <span>Espacer davantage les lignes</span>
        <input
          type="checkbox"
          checked={value.spacious}
          onChange={(e) => onChange({ ...value, spacious: e.target.checked })}
          className="size-5 accent-[var(--primary)]"
        />
      </label>
      <SoundToggle />
      <div
        className="reader-surface rounded-2xl overflow-hidden border border-white/10"
        data-reading-theme={value.theme}
        style={
          {
            "--reading-size": `${value.fontSize}px`,
            "--reading-leading": value.spacious ? "1.95" : "1.65",
          } as CSSProperties
        }
      >
        <div className="reading-paper !m-0 !rounded-none !border-0 !shadow-none" aria-label="Aperçu de lecture">
          <p className="font-serif m-0">
            La forêt s’ouvre devant vous. Un sentier disparaît entre les arbres.
            Où vos pas vous mèneront-ils ?
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-5">
        Ces réglages concernent le récit, pas les illustrations. Ils sont
        mémorisés sur cet appareil lorsque le stockage du navigateur est
        disponible.
      </p>
    </div>
  );
}

function SoundToggle() {
  const [muted, setMutedState] = useState(false);
  useEffect(() => { setMutedState(isMuted()); }, []);
  return (
    <label className="flex items-center justify-between gap-3 min-h-12 cursor-pointer text-sm rounded-xl border border-white/10 bg-white/[0.03] px-3">
      <span className="flex items-center gap-2">🔊 Son & haptics <span className="text-xs text-muted-foreground">(bruissement, pièces)</span></span>
      <input
        type="checkbox"
        checked={!muted}
        onChange={(e) => { setMuted(!e.target.checked); setMutedState(!e.target.checked); }}
        className="size-5 accent-[var(--primary)]"
        aria-label="Activer le son"
      />
    </label>
  );
}
