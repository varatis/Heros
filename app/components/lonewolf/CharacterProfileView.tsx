"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getLocalHeroProfile,
  saveLocalHeroProfile,
  type HeroProfile,
} from "@/lib/hero-profile";
import { BOOKMARKS, type Bookmark, getBookmarkById } from "@/lib/bookmarks";
import BookmarkVisual from "@/components/shared/BookmarkVisual";
import FeuilleJoueur from "@/components/lonewolf/FeuilleJoueur";
import {
  Check,
  ChevronRight,
  Edit3,
  Flame,
  Gem,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Crown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StreakFlame from "@/components/shared/StreakFlame";
import GemIcon from "@/components/shared/GemIcon";
import { getStreak, isAtRisk } from "@/lib/streak";
import ReadingSettings from "@/components/lonewolf/ReadingSettings";
import { DEFAULT_READING, READING_KEY, parseReadingPreferences, type ReadingPreferences } from "@/lib/lonewolf/reading-preferences";
import { BookOpen as BookOpenIcon, Type } from "lucide-react";

export default function CharacterProfileView({
  serverProfile,
  serverWallet,
  serverFins,
}: {
  serverProfile?: any;
  serverWallet?: any;
  serverFins?: any[];
}) {
  const [profile, setProfile] = useState<HeroProfile | null>(null);
  const [isChangingBookmark, setIsChangingBookmark] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [reading, setReading] = useState<ReadingPreferences>(DEFAULT_READING);

  useEffect(() => {
    const p = getLocalHeroProfile();
    setProfile(p);
    setNameInput(serverProfile?.username || p.heroName);
    try {
      const raw = localStorage.getItem(READING_KEY);
      if (raw) setReading(parseReadingPreferences(JSON.parse(raw)));
    } catch {}
  }, [serverProfile]);

  function updateReading(value: ReadingPreferences) {
    setReading(value);
    try { localStorage.setItem(READING_KEY, JSON.stringify(value)); } catch {}
  }

  if (!profile) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
        <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const currentHeroName = serverProfile?.username || profile.heroName;
  const currentBookmark = getBookmarkById(
    serverProfile?.avatar_url || profile.bookmarkId,
  );

  function handleSelectBookmark(b: Bookmark) {
    saveLocalHeroProfile(currentHeroName, b.id);
    setProfile(getLocalHeroProfile());
    setIsChangingBookmark(false);
  }

  function handleSaveName() {
    if (nameInput.trim()) {
      saveLocalHeroProfile(nameInput.trim(), currentBookmark.id);
      setProfile(getLocalHeroProfile());
      setIsEditingName(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ----- Couverture du héros ----- */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/forest-reader-night.jpg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0a110d] via-[#0a110d]/55 to-[#0a110d]/25"
          aria-hidden="true"
        />
        <div className="relative space-y-3 px-5 pb-6 pt-9 text-center">
          <button
            type="button"
            onClick={() => setIsChangingBookmark(!isChangingBookmark)}
            aria-label="Changer de marque-page"
            aria-expanded={isChangingBookmark}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <BookmarkVisual bookmark={currentBookmark} size="md" selected />
          </button>

          {isEditingName ? (
            <span className="mx-auto flex max-w-xs items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={25}
                autoFocus
                aria-label="Nom du héros"
                className="h-11 min-w-0 flex-1 rounded-xl border border-[#dfbb78] bg-black/50 px-3.5 text-center font-serif text-lg text-foreground"
              />
              <button
                type="button"
                onClick={handleSaveName}
                aria-label="Enregistrer le nom"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#dfbb78] text-[#1c1507]"
              >
                <Check size={18} />
              </button>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
                {currentHeroName}
              </h1>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                aria-label="Modifier le nom"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Edit3 size={15} />
              </button>
            </span>
          )}

          <p className="text-sm text-white/65">
            Porteur du{" "}
            <strong className="font-semibold text-white">
              {currentBookmark.name}
            </strong>{" "}
            · {currentBookmark.title}
          </p>
          <p>
            <span
              className="pill"
              style={{
                color: currentBookmark.accentColor,
                borderColor: `${currentBookmark.accentColor}55`,
                backgroundColor: `${currentBookmark.accentColor}14`,
              }}
            >
              {currentBookmark.rarity}
            </span>
          </p>
        </div>
      </section>

      {/* ----- Statistiques + Braise ----- */}
      <section
        className="card grid grid-cols-3 divide-x divide-white/[0.07]"
        aria-label="Statistiques du héros"
      >
        <Stat
          icon={<GemIcon size="xs" variant="ice" title="" />}
          value={`${(serverWallet?.gems ?? 250).toLocaleString("fr-FR")}`}
          label="Gemmes"
          tone="text-[#dfbb78]"
        />
        <Stat
          icon={<Flame size={17} />}
          value={`${serverProfile?.streak_days || getStreak().current || 0} j`}
          label="Braise"
          tone="text-orange-400"
        />
        <Stat
          icon={<Sparkles size={17} />}
          value={`${serverFins?.length || 0}`}
          label="Fins"
          tone="text-emerald-300"
        />
      </section>

      {/* ----- Braise détaillée + Ligue ----- */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Flame size={14} className="text-orange-400" /> Braise Kaï</h3>
            <StreakFlame compact />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Série actuelle</span><strong className="text-foreground">{getStreak().current} jours</strong></div>
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Record</span><strong className="text-foreground">{getStreak().best} jours</strong></div>
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Talismans</span><strong className="text-foreground">❄️ {getStreak().freezes}</strong></div>
            {isAtRisk(getStreak()) && <p className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2 text-xs font-semibold text-orange-300">Ta braise vacille — lis un paragraphe avant minuit pour la garder allumée !</p>}
          </div>
        </div>
        <div className="card p-4 space-y-2.5 tavern-sign">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Crown size={14} className="text-[#dfbb78]" /> Ligue des Lecteurs</h3>
          {(() => {
            const s = getStreak().current;
            const league = s >= 30 ? { name: "Or", cls: "league-gold", icon: "👑", desc: "Légende du Magnamund" } : s >= 7 ? { name: "Argent", cls: "league-silver", icon: "⚔️", desc: "Vétéran Kaï" } : s >= 3 ? { name: "Bronze", cls: "league-bronze", icon: "🛡️", desc: "Écuyer" } : { name: "Novice", cls: "bg-white/10 text-muted-foreground", icon: "📖", desc: "Premiers pas" };
            const next = s >= 30 ? 30 : s >= 7 ? 30 : s >= 3 ? 7 : 3;
            const prog = Math.min(100, (s / next) * 100);
            return (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className={"league-badge " + league.cls}>{league.icon} {league.name}</span>
                  <span className="text-xs text-muted-foreground">{league.desc}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>{s} j</span><span>{next} j</span></div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#dfbb78] to-[#eed09a] transition-all" style={{ width: `${prog}%` }} /></div>
                  <p className="text-[11px] text-muted-foreground">{s < next ? `Encore ${next - s} jour(s) pour passer ${next >=30?"Or": next>=7?"Argent":"Bronze"}.` : "Tu es au sommet, héros."}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ----- Aventure en cours ----- */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Swords size={18} className="text-[#dfbb78]" />
          Mon aventure
        </h2>
        <FeuilleJoueur />
      </section>

      {/* ----- Progression ----- */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Trophy size={18} className="text-[#dfbb78]" />
          Progression
        </h2>
        <Link
          href="/achievements"
          className="card group flex items-center gap-3.5 p-4 transition-colors hover:border-[#dfbb78]/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-[#dfbb78]">
            <Trophy size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-foreground">
              Succès & badges
            </span>
            <span className="block truncate text-[13px] text-muted-foreground">
              Vos exploits dans le Magnamund
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#dfbb78]"
          />
        </Link>
      </section>

      {/* ----- Personnalisation ----- */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Edit3 size={18} className="text-[#dfbb78]" />
          Personnaliser
        </h2>
        <button
          type="button"
          onClick={() => setIsChangingBookmark(!isChangingBookmark)}
          aria-expanded={isChangingBookmark}
          className="card flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:border-[#dfbb78]/40"
        >
          <span className="text-2xl" aria-hidden="true">
            {currentBookmark.iconEmoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-foreground">
              Marque-page
            </span>
            <span className="block truncate text-[13px] text-muted-foreground">
              {currentBookmark.name} · {currentBookmark.rarity}
            </span>
          </span>
          <ChevronRight
            size={18}
            className={cn(
              "shrink-0 text-muted-foreground transition-transform",
              isChangingBookmark && "rotate-90 text-[#dfbb78]",
            )}
          />
        </button>

        {isChangingBookmark && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BOOKMARKS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBookmark(b)}
                aria-pressed={b.id === currentBookmark.id}
                className={cn(
                  "flex min-h-[64px] items-center gap-2.5 rounded-2xl border p-3 text-left transition-colors",
                  b.id === currentBookmark.id
                    ? "border-[#dfbb78] bg-[#18251e]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                )}
              >
                <span className="text-xl" aria-hidden="true">
                  {b.iconEmoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-serif text-[13px] font-bold text-foreground">
                    {b.name}
                  </span>
                  <span
                    className="block text-[11px]"
                    style={{ color: b.accentColor }}
                  >
                    {b.rarity}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        <Link
          href="/onboarding"
          className="card group flex items-center gap-3.5 p-4 transition-colors hover:border-[#dfbb78]/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl">
            🛡️
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-foreground">
              Refaire le rituel
            </span>
            <span className="block truncate text-[13px] text-muted-foreground">
              Nouveau nom, nouveau marque-page
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#dfbb78]"
          />
        </Link>
      </section>

      {/* ----- Lecture : confort de lecture ----- */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Type size={18} className="text-[#dfbb78]" />
          Lecture
        </h2>
        <div className="card p-4">
          <ReadingSettings value={reading} onChange={updateReading} />
          <Link href="/regles" className="btn btn-ghost btn-sm btn-block gap-2 mt-3">
            <BookOpenIcon size={16} /> Relire les règles Kaï
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
      <span
        className={cn(
          "flex items-center gap-1.5 text-lg font-bold tabular-nums",
          tone,
        )}
      >
        {icon}
        {value}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
