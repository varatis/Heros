"use client";
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
      <div className="reading-paper" aria-label="Aperçu de lecture">
        <p className="font-serif">
          La forêt s’ouvre devant vous. Un sentier disparaît entre les arbres.
          Où vos pas vous mèneront-ils ?
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-5">
        Ces réglages concernent le récit, pas les illustrations. Ils sont
        mémorisés sur cet appareil lorsque le stockage du navigateur est
        disponible.
      </p>
    </div>
  );
}
