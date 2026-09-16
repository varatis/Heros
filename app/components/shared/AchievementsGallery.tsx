"use client";
import { useState } from "react";
import { LockKeyhole, Check, Gem, Trophy } from "lucide-react";
import AchievementMedal from "./AchievementMedal";
import { cn } from "@/lib/utils";
export interface Succes {
  slug: string;
  nom: string;
  description: string | null;
  gemmes: number | null;
}
export default function AchievementsGallery({
  succes,
  unlocked,
  connected,
}: {
  succes: Succes[];
  unlocked: string[];
  connected: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const earned = new Set(unlocked);
  const count = succes.filter((s) => earned.has(s.slug)).length;
  const visible = succes.filter(
    (s) =>
      filter === "all" ||
      (filter === "earned" ? earned.has(s.slug) : !earned.has(s.slug)),
  );
  return (
    <div className="space-y-7">
      <section className="panel p-6 flex flex-col sm:flex-row gap-6 sm:items-center">
        <div className="text-primary">
          <Trophy size={38} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="font-serif text-xl">Votre collection de badges</h2>
            <span className="text-sm text-primary">
              {connected
                ? `${count} / ${succes.length} débloqués`
                : `${succes.length} badges à découvrir`}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Succès débloqués"
            aria-valuemin={0}
            aria-valuemax={succes.length || 1}
            aria-valuenow={count}
            className="h-2 bg-muted rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary"
              style={{
                width: `${succes.length ? (count / succes.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {connected
              ? "Seuls les succès enregistrés sur votre compte sont affichés comme obtenus."
              : "Connectez-vous pour voir les badges obtenus sur votre compte."}
          </p>
        </div>
      </section>
      <div
        role="group"
        aria-label="Filtrer les succès"
        className="flex gap-2 flex-wrap"
      >
        {[
          { id: "all", label: "Tous les succès" },
          { id: "earned", label: "Débloqués" },
          { id: "locked", label: "À débloquer" },
        ].map((f) => (
          <button
            key={f.id}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-3 text-sm rounded-lg border",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "border-border text-muted-foreground hover:bg-card",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((s) => (
          <article key={s.slug} className="panel p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <AchievementMedal slug={s.slug} />
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs rounded-md border px-2 py-1",
                  earned.has(s.slug)
                    ? "text-hero-emerald border-hero-emerald/30"
                    : "text-muted-foreground border-border",
                )}
              >
                {earned.has(s.slug) ? (
                  <Check size={12} />
                ) : (
                  <LockKeyhole size={12} />
                )}{" "}
                {earned.has(s.slug) ? "Obtenu" : "À débloquer"}
              </span>
            </div>
            <h3 className="font-serif text-xl">{s.nom}</h3>
            <p className="text-sm text-muted-foreground leading-6 min-h-12">
              {s.description}
            </p>
            <p className="border-t border-border pt-4 text-xs text-primary flex items-center gap-2">
              <Gem size={15} />
              {s.gemmes ?? 0} gemmes · récompense prévue
            </p>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="panel p-10 text-center space-y-3">
          <Trophy className="mx-auto text-primary" />
          <h2 className="font-serif text-xl">La légende reste à écrire</h2>
          <p className="text-muted-foreground text-sm">
            Aucun succès {filter === "earned" ? "débloqué" : "à afficher"} pour
            le moment.
          </p>
        </div>
      )}
    </div>
  );
}
