"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { COUPS_PORTES, COLONNES_QA } from "@/lib/lonewolf/rules";

/**
 * Reproduction exacte de la Table des Coups Portés du livre :
 * en haut le Quotient d'Attaque, sur le côté le nombre tiré à la Table de Hasard,
 * et dans la case les points d'Endurance perdus par chacun des deux adversaires.
 */
export default function TableCoupsPortes() {
  const [qa, setQa] = useState(0);
  const [nombre, setNombre] = useState<number | null>(null);

  const colonne = COLONNES_QA.findIndex((c) => qa >= c.min && qa <= c.max);
  const caseChoisie =
    nombre !== null ? COUPS_PORTES[nombre][colonne] : null;

  return (
    <div className="space-y-4">
      {/* Sélecteur de Quotient d'Attaque */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Quotient d&apos;Attaque
            </div>
            <div className="text-2xl font-black tabular-nums gradient-hero">
              {qa > 0 ? `+${qa}` : qa}
            </div>
          </div>
          <div className="text-right text-[11px] text-muted-foreground max-w-[16rem]">
            Votre Habileté (avec bonus) moins l&apos;Habileté de l&apos;adversaire.
            Faites glisser pour voir la colonne correspondante s&apos;illuminer
            ci-dessous.
          </div>
        </div>
        <input
          type="range"
          min={-11}
          max={11}
          step={1}
          value={qa}
          onChange={(e) => setQa(parseInt(e.target.value, 10))}
          className="w-full accent-[--hero-gold]"
          aria-label="Quotient d'attaque"
        />
        <input
          type="range"
          min={-30}
          max={30}
          step={1}
          value={qa}
          onChange={(e) => setQa(parseInt(e.target.value, 10))}
          className="w-full accent-[--hero-gold] opacity-60"
          aria-label="Quotient d'attaque étendu (les valeurs extrêmes sont ramenées à ≤ -11 ou ≥ +11)"
        />
      </div>

      {/* Le tableau */}
      <div className="overflow-x-auto glass-card rounded-2xl p-3">
        <table className="w-full text-[10px] sm:text-xs border-separate border-spacing-0.5 min-w-[46rem]">
          <thead>
            <tr>
              <th className="p-1 text-muted-foreground font-bold sticky left-0 bg-[--hero-surface]/10 backdrop-blur">
                Hasard
              </th>
              {COLONNES_QA.map((c, i) => (
                <th
                  key={c.label}
                  className={`p-1 rounded-t-md font-bold transition-colors ${
                    i === colonne
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COUPS_PORTES.map((ligne, n) => (
              <tr key={n}>
                <th
                  className={`p-1 rounded-l-md font-bold transition-colors ${
                    nombre === n
                      ? "bg-[--hero-gold] text-black"
                      : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {n}
                </th>
                {ligne.map(([e, j], i) => {
                  const estCase = nombre === n && i === colonne;
                  const tue = e === "K" || j === "K";
                  return (
                    <td key={i} className="p-0">
                      <motion.button
                        onClick={() => setNombre(n)}
                        animate={estCase ? { scale: 1.06 } : { scale: 1 }}
                        className={`w-full px-1 py-1.5 rounded-md tabular-nums transition-colors text-center ${
                          estCase
                            ? "bg-[--hero-gold] text-black font-black ring-2 ring-primary shadow-lg"
                            : i === colonne
                              ? "bg-primary/10 hover:bg-primary/25"
                              : "bg-muted/25 hover:bg-muted/50"
                        }`}
                        title={`Hasard ${n} · Quotient ${COLONNES_QA[i].label} : vous perdez ${
                          j === "K" ? "tout (mort)" : j
                        }, l'adversaire perd ${e === "K" ? "tout (mort)" : e}`}
                      >
                        <span className={tue ? "text-red-400" : ""}>
                          {e === "K" ? "K" : e}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className={j === "K" ? "text-red-400" : ""}>
                          {j === "K" ? "K" : j}
                        </span>
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lecture du résultat */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
        <Swords className="w-5 h-5 text-[--hero-gold] shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          {nombre === null || !caseChoisie ? (
            <p className="text-muted-foreground">
              Cliquez une case du tableau pour lire le résultat de l&apos;assaut :
              le premier chiffre est l&apos;Endurance perdue par votre adversaire,
              le second celle que vous perdez.
            </p>
          ) : (
            <p>
              <span className="font-bold">
                Nombre {nombre}, Quotient d&apos;Attaque {qa > 0 ? `+${qa}` : qa}
              </span>{" "}
              : l&apos;adversaire perd{" "}
              <span className="font-bold text-[--hero-emerald]">
                {caseChoisie[0] === "K"
                  ? "toute son Endurance (tué sur le coup)"
                  : `${caseChoisie[0]} point(s) d'Endurance`}
              </span>{" "}
              et vous perdez{" "}
              <span className="font-bold text-red-400">
                {caseChoisie[1] === "K"
                  ? "tout (vous êtes mort)"
                  : `${caseChoisie[1]} point(s) d'Endurance`}
              </span>
              .
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            « K » signifie que le coup est mortel. Remarquez la dissymétrie du
            tableau : à Quotient d&apos;Attaque 0, vous êtes déjà avantagé — et si
            vous tirez 0, vous ne perdez jamais rien.
          </p>
        </div>
      </div>
    </div>
  );
}
