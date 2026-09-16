"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, RotateCcw, MousePointerClick } from "lucide-react";
import {
  genererTableHasard,
  nouvelleGraine,
  tirerNombre,
} from "@/lib/lonewolf/table-hasard";
import { Button } from "@/components/ui/button";

/**
 * Représentation vivante de la Table de Hasard du livre.
 * Dans la version papier, le lecteur ferme les yeux et pointe une case avec
 * son crayon : le chiffre désigné (0 à 9) est son « nombre aléatoire ».
 */
export default function TableHasard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [graine, setGraine] = useState(() => nouvelleGraine());
  const grille = useMemo(() => genererTableHasard(graine), [graine]);
  const [selection, setSelection] = useState<{
    ligne: number;
    colonne: number;
  } | null>(null);
  const [dernier, setDernier] = useState<number | null>(null);
  const [historique, setHistorique] = useState<number[]>([]);
  const [roulement, setRoulement] = useState(false);

  const nombre = selection ? grille[selection.ligne][selection.colonne] : null;

  function pointer(ligne: number, colonne: number) {
    setSelection({ ligne, colonne });
    const n = grille[ligne][colonne];
    setDernier(n);
    setHistorique((h) => [...h.slice(-19), n]);
  }

  async function hasard() {
    setRoulement(true);
    setDernier(null);
    // Petite animation de « roulement » : on fait défiler des cases.
    for (let i = 0; i < 8; i++) {
      const l = Math.floor(Math.random() * 10);
      const c = Math.floor(Math.random() * 10);
      setSelection({ ligne: l, colonne: c });
      await new Promise((r) => setTimeout(r, 60 + i * 12));
    }
    const l = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    setSelection({ ligne: l, colonne: c });
    const n = grille[l][c];
    setDernier(n);
    setHistorique((h) => [...h.slice(-19), n]);
    setRoulement(false);
  }

  function nouvelleTable() {
    setGraine(nouvelleGraine());
    setSelection(null);
    setDernier(null);
    setHistorique([]);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start">
        {/* Le résultat */}
        <div className="space-y-2">
          <div className="glass-card rounded-2xl p-4 w-32 sm:w-40 text-center space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Nombre tiré
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${dernier}-${historique.length}`}
                initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="text-5xl sm:text-6xl font-black gradient-hero tabular-nums"
              >
                {dernier ?? "–"}
              </motion.div>
            </AnimatePresence>
            <div className="text-[10px] text-muted-foreground">
              {selection
                ? `ligne ${selection.ligne + 1}, colonne ${selection.colonne + 1}`
                : "pointez une case"}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-32 sm:w-40">
            <Button
              size="sm"
              onClick={hasard}
              disabled={roulement}
              className="w-full gap-1.5 text-xs font-bold"
            >
              <Dices className={`w-3.5 h-3.5 ${roulement ? "animate-spin" : ""}`} />
              {roulement ? "Le hasard…" : "Laissez faire le hasard"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={nouvelleTable}
              className="w-full gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Nouvelle table
            </Button>
          </div>

          {historique.length > 0 && (
            <div className="w-32 sm:w-40 text-[10px] text-muted-foreground">
              <div className="font-bold uppercase tracking-wider mb-1">
                Vos tirages
              </div>
              <div className="flex flex-wrap gap-1">
                {historique.slice(-12).map((n, i) => (
                  <span
                    key={i}
                    className={`inline-flex w-5 h-5 items-center justify-center rounded bg-muted/60 font-bold tabular-nums ${
                      i === Math.min(historique.length, 12) - 1
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* La grille 10×10 */}
        <div
          className={`glass-card rounded-2xl p-2 sm:p-3 ${
            compact ? "" : "overflow-x-auto"
          }`}
        >
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-[1.6rem_repeat(10,minmax(1.6rem,1fr))] gap-1 text-center">
              <div />
              {Array.from({ length: 10 }).map((_, c) => (
                <div
                  key={c}
                  className="text-[10px] text-muted-foreground font-bold pb-1"
                >
                  {c + 1}
                </div>
              ))}
              {grille.map((ligne, l) => (
                <div key={l} className="contents">
                  <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center">
                    {l + 1}
                  </div>
                  {ligne.map((n, c) => {
                    const estSelectionne =
                      selection?.ligne === l && selection?.colonne === c;
                    return (
                      <motion.button
                        key={`${l}-${c}`}
                        onClick={() => pointer(l, c)}
                        whileHover={{ scale: 1.14 }}
                        whileTap={{ scale: 0.92 }}
                        animate={
                          estSelectionne
                            ? { scale: [1, 1.25, 1.1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.25 }}
                        className={`aspect-square rounded-md text-[11px] sm:text-xs font-bold tabular-nums transition-colors ${
                          estSelectionne
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-2 ring-[--hero-gold]"
                            : "bg-muted/40 hover:bg-primary/25 text-foreground/80"
                        }`}
                        aria-label={`Ligne ${l + 1} colonne ${c + 1} : ${n}`}
                      >
                        {n}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
        <MousePointerClick className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          Vous pouvez pointer une case vous-même — comme au crayon — ou laisser
          l&apos;application choisir. Chaque nouvelle table contient exactement dix
          fois chaque chiffre de 0 à 9, comme la Table de Hasard du livre.
        </span>
      </p>
    </div>
  );
}

/** Petit utilitaire exposé pour les autres écrans de l'application. */
export function tirerUnNombre(): number {
  return tirerNombre();
}
