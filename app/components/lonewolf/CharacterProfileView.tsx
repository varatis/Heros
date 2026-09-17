"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLocalHeroProfile, saveLocalHeroProfile, HeroProfile } from "@/lib/hero-profile";
import { BOOKMARKS, Bookmark, getBookmarkById } from "@/lib/bookmarks";
import BookmarkVisual from "@/components/shared/BookmarkVisual";
import FeuilleJoueur from "@/components/lonewolf/FeuilleJoueur";
import {
  Gem,
  Flame,
  ScrollText,
  BookOpen,
  Sparkles,
  Shield,
  Compass,
  Check,
  Edit3,
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

  if (!profile) return null;

  const currentHeroName = serverProfile?.username || profile.heroName;
  const currentBookmark = getBookmarkById(
    serverProfile?.avatar_url || profile.bookmarkId
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
    <div className="space-y-8">
      {/* Carte d'identité du héros et de son marque-page */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dfbb78]/30 bg-gradient-to-br from-[#121c16] via-[#0d1410] to-[#070c0a] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Visuel du marque-page du héros */}
          <div className="shrink-0 flex flex-col items-center">
            <BookmarkVisual
              bookmark={currentBookmark}
              size="md"
              selected
            />
            <button
              type="button"
              onClick={() => setIsChangingBookmark(!isChangingBookmark)}
              className="mt-3 text-[11px] text-[#dfbb78] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={12} />
              <span>Changer de signet</span>
            </button>
          </div>

          {/* Informations du héros */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="h-9 px-3 rounded-xl bg-white/10 border border-[#dfbb78] text-foreground font-serif text-lg"
                    maxLength={25}
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-3 py-1.5 rounded-xl bg-[#dfbb78] text-[#1c1507] text-xs font-bold"
                  >
                    Sauver
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {currentHeroName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-muted-foreground hover:text-white"
                    title="Modifier le nom"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-[#dfbb78]/15 border border-[#dfbb78]/30 text-[#dfbb78] text-xs font-mono font-bold">
                {currentBookmark.rarity}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Porteur du <strong className="text-foreground">{currentBookmark.name}</strong> ({currentBookmark.title}).
              {currentBookmark.tagline}
            </p>

            {/* Badges de stats et de progression */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dfbb78]/10 border border-[#dfbb78]/20 text-[#dfbb78] text-xs font-bold">
                <Gem className="w-3.5 h-3.5" />
                <span>{serverWallet?.gems ?? 250} Gemmes</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{serverProfile?.streak_days || 1} jours d&apos;assiduité</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{serverFins?.length || 0} fin(s) découverte(s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal / tiroir de changement de marque-page */}
        {isChangingBookmark && (
          <div className="p-4 rounded-2xl bg-[#090f0c] border border-white/10 space-y-3 animate-in fade-in duration-200">
            <p className="text-xs uppercase tracking-wider text-[#dfbb78] font-semibold">
              Choisir un nouveau marque-page :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BOOKMARKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBookmark(b)}
                  className={cn(
                    "p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                    b.id === currentBookmark.id
                      ? "bg-[#18251e] border-[#dfbb78] text-foreground"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] text-muted-foreground"
                  )}
                >
                  <span className="text-xl">{b.iconEmoji}</span>
                  <div className="min-w-0">
                    <p className="font-serif text-xs font-bold truncate">
                      {b.name}
                    </p>
                    <p className="text-[10px]" style={{ color: b.accentColor }}>
                      {b.rarity}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feuille de joueur / feuille d'aventure */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ScrollText className="w-5 h-5 text-[#dfbb78]" />
            <span>Feuille d&apos;Aventure</span>
          </h2>
          <Link href="/regles">
            <button className="reader-tool text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Règles Kaï</span>
            </button>
          </Link>
        </div>

        <FeuilleJoueur />

        <div className="pt-2">
          <Link href="/achievements" className="action-link action-secondary">
            Voir mes badges et succès de lecteur →
          </Link>
        </div>
      </section>
    </div>
  );
}
