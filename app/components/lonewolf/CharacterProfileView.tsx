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
  BookOpen,
  Check,
  ChevronRight,
  Edit3,
  Flame,
  Gem,
  ScrollText,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const p = getLocalHeroProfile();
    setProfile(p);
    setNameInput(serverProfile?.username || p.heroName);
  }, [serverProfile]);

  if (!profile) {
    return (
      <div className="card animate-pulse p-6" aria-hidden="true">
        <div className="h-6 w-40 rounded bg-white/10" />
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
    <div className="space-y-6">
      <header className="page-head">
        <p className="eyebrow">Identité de lecteur</p>
        <h1>Mon héros</h1>
      </header>

      {/* ----- Carte d'identité ----- */}
      <section className="card card-gold space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsChangingBookmark(!isChangingBookmark)}
            aria-label="Changer de marque-page"
            className="shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            <BookmarkVisual bookmark={currentBookmark} size="sm" selected />
          </button>
          <div className="min-w-0 flex-1 space-y-1">
            {isEditingName ? (
              <span className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={25}
                  autoFocus
                  aria-label="Nom du héros"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-[#dfbb78] bg-white/10 px-3 font-serif text-base text-foreground"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  aria-label="Enregistrer le nom"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#dfbb78] text-[#1c1507]"
                >
                  <Check size={17} />
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <h2 className="truncate font-serif text-xl font-bold text-white sm:text-2xl">
                  {currentHeroName}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  aria-label="Modifier le nom"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-white"
                >
                  <Edit3 size={15} />
                </button>
              </span>
            )}
            <p className="truncate text-[13px] text-muted-foreground">
              <strong className="font-semibold text-foreground">
                {currentBookmark.name}
              </strong>{" "}
              · {currentBookmark.title} · {currentBookmark.rarity}
            </p>
          </div>
        </div>

        {/* Stats en une ligne */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4">
          <Stat
            icon={<Gem size={16} />}
            value={`${serverWallet?.gems ?? 250}`}
            label="Gemmes"
            tone="text-[#dfbb78]"
          />
          <Stat
            icon={<Flame size={16} />}
            value={`${serverProfile?.streak_days || 1} j`}
            label="Assiduité"
            tone="text-orange-400"
          />
          <Stat
            icon={<Sparkles size={16} />}
            value={`${serverFins?.length || 0}`}
            label="Fins"
            tone="text-emerald-300"
          />
        </div>

        {/* Choix du marque-page */}
        {isChangingBookmark && (
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#090f0c] p-3 sm:grid-cols-3">
            {BOOKMARKS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBookmark(b)}
                aria-pressed={b.id === currentBookmark.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
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
      </section>

      {/* ----- Raccourcis ----- */}
      <nav
        aria-label="Raccourcis du héros"
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      >
        <Shortcut
          href="/achievements"
          icon={<Trophy size={18} />}
          title="Succès & badges"
          sub="Voir mes exploits"
        />
        <Shortcut
          href="/regles"
          icon={<BookOpen size={18} />}
          title="Règles Kaï"
          sub="Habileté, combats…"
        />
        <Shortcut
          href="/onboarding"
          icon={<ScrollText size={18} />}
          title="Refaire le rituel"
          sub="Nom & marque-page"
        />
      </nav>

      {/* ----- Feuille d'aventure ----- */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
          <ScrollText size={20} className="text-[#dfbb78]" />
          Feuille d&apos;Aventure
        </h2>
        <FeuilleJoueur />
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
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-white/[0.03] px-2 py-2.5 text-center">
      <span className={cn("flex items-center gap-1.5 text-base font-bold tabular-nums", tone)}>
        {icon}
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Shortcut({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="card group flex items-center gap-3 p-3.5 transition-colors hover:border-[#dfbb78]/40"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#dfbb78]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-foreground">
          {title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {sub}
        </span>
      </span>
      <ChevronRight
        size={17}
        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#dfbb78]"
      />
    </Link>
  );
}
