"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LDVELH_COLLECTIONS,
  LDVELHBook,
  LDVELHCollection,
  getAllBooks,
} from "@/lib/ldvelh-collections";
import { Bookmark, getBookmarkById } from "@/lib/bookmarks";
import { getLocalHeroProfile } from "@/lib/hero-profile";
import BookmarkVisual from "@/components/shared/BookmarkVisual";
import {
  Search,
  BookOpen,
  Library,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Filter,
  Flame,
  Swords,
  ChevronRight,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogueClientProps {
  ownedSlugs?: string[];
  initialHeroName?: string;
  initialBookmarkId?: string;
}

export default function CatalogueClient({
  ownedSlugs = ["loup-solitaire-01"],
  initialHeroName,
  initialBookmarkId,
}: CatalogueClientProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "grimoire" | "playable">("all");
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Profil héros & marque-page
  const profile = useMemo(() => {
    const p = getLocalHeroProfile();
    return {
      heroName: initialHeroName || p.heroName || "Loup Solitaire",
      bookmark: getBookmarkById(initialBookmarkId || p.bookmarkId),
    };
  }, [initialHeroName, initialBookmarkId]);

  const allBooks = useMemo(() => getAllBooks(), []);

  // Filtrage combiné (collection + recherche + mode)
  const filteredBooks = useMemo(() => {
    let pool = allBooks;

    // Filtre collection
    if (selectedCollectionId !== "all") {
      pool = pool.filter((b) => b.collectionId === selectedCollectionId);
    }

    // Filtre mode
    if (filterMode === "grimoire") {
      pool = pool.filter((b) => b.isPlayable || b.isFree || ownedSlugs.includes(b.id));
    } else if (filterMode === "playable") {
      pool = pool.filter((b) => b.isPlayable);
    }

    // Filtre recherche textuelle
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter(
        (b) =>
          b.titre.toLowerCase().includes(q) ||
          b.collectionName.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.resume.toLowerCase().includes(q)
      );
    }

    return pool;
  }, [allBooks, selectedCollectionId, filterMode, searchQuery, ownedSlugs]);

  const selectedCollection = useMemo(
    () => LDVELH_COLLECTIONS.find((c) => c.id === selectedCollectionId),
    [selectedCollectionId]
  );

  return (
    <div className="space-y-8">
      {/* En-tête atmosphérique dark fantasy */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow flex items-center gap-2">
            <span className="w-4 h-px bg-[#dfbb78]" />
            Grimoires & Chroniques Nocturnes
          </p>
          {/* Badge héros & signet actif */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-muted-foreground">
            <span className="text-[#dfbb78]">{profile.bookmark.iconEmoji}</span>
            <span>
              Signet de <strong className="text-foreground">{profile.heroName}</strong>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#dfbb78]">{profile.bookmark.name}</span>
          </div>
        </div>

        <h1 className="page-title text-foreground">
          Ma Bibliothèque
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed italic font-serif">
          « Dans le silence de la forêt, chaque tome ouvert réveille les échos d&apos;une
          aventure oubliée. Choisissez votre chemin parmi les 19 sagas immortelles. »
        </p>

        {/* Compteurs 2026 UI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
              Bibliothèques
            </p>
            <p className="text-2xl font-serif font-bold text-[#dfbb78]">19</p>
            <p className="text-[11px] text-muted-foreground">Séries répertoriées</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
              Tomes au Total
            </p>
            <p className="text-2xl font-serif font-bold text-foreground">170</p>
            <p className="text-[11px] text-muted-foreground">Aventures LDVELH</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-emerald-900/40 bg-emerald-950/10">
            <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono">
              Interactif Jouable
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-300">Livre 1</p>
            <p className="text-[11px] text-emerald-200/70">Moteur Kaï complet</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
              Votre Statut
            </p>
            <p className="text-2xl font-serif font-bold text-[#dfbb78] truncate">
              {profile.heroName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {profile.bookmark.title}
            </p>
          </div>
        </div>
      </header>

      {/* CARTE HERO : REPRENDRE L'AVENTURE EN COURS (LOUP SOLITAIRE 01) */}
      <section className="relative overflow-hidden rounded-3xl border border-[#dfbb78]/30 bg-gradient-to-r from-[#111a14] via-[#0f1712] to-[#0a110d] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
        {/* Glow magique */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#dfbb78]/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 z-10">
          {/* Couverture haute qualité */}
          <div className="w-32 sm:w-40 shrink-0 aspect-[2/3] rounded-xl overflow-hidden border border-[#dfbb78]/40 shadow-2xl bg-[#090f0c] group">
            <img
              src="/lonewolf/pdf/originals/p001-x4.png"
              alt="Loup Solitaire 01 Couverture"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Description et actions directes */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aventure Interactive Prête à Jouer</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Loup Solitaire 01 · Les Maîtres des Ténèbres
            </h2>

            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xl">
              Le monastère Kaï est détruit sous le vol des Kraans. Vous êtes le
              dernier Seigneur Kaï vivant. Prenez la route de la capitale,
              choisissez vos disciplines et survivez aux combats.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                href="/jouer"
                className="action-link text-sm h-11 px-6 shadow-[0_4px_20px_rgba(223,187,120,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Swords size={17} />
                <span>Lire l&apos;aventure interactive</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/character"
                className="action-link action-secondary text-sm h-11 px-4"
              >
                <span>Feuille d&apos;Aventure</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SÉLECTEUR RAPIDE DES 19 BIBLIOTHÈQUES & FILTRES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Barre de recherche instantanée */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher parmi les 170 tomes ou auteurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#dfbb78] focus:bg-white/[0.07] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtres de vue (Tous / Dans mon grimoire / Prêts à jouer) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 overflow-x-auto text-xs shrink-0">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap",
                filterMode === "all"
                  ? "bg-[#dfbb78] text-[#1c1507] font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Tous ({allBooks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("grimoire")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap",
                filterMode === "grimoire"
                  ? "bg-[#dfbb78] text-[#1c1507] font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mon Grimoire (1)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("playable")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap",
                filterMode === "playable"
                  ? "bg-[#dfbb78] text-[#1c1507] font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Prêt à jouer (1)
            </button>
          </div>
        </div>

        {/* CARROUSEL HORIZONTAL DES 19 BIBLIOTHÈQUES (2026 UX) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Library size={14} className="text-[#dfbb78]" />
              Bibliothèques LDVELH disponibles ({LDVELH_COLLECTIONS.length})
            </span>
            <button
              type="button"
              onClick={() => setShowCollectionModal(true)}
              className="text-[#dfbb78] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Voir la grille complète</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 hide-scrollbar -mx-2 px-2 scroll-smooth">
            {/* Bouton Toutes les bibliothèques */}
            <button
              type="button"
              onClick={() => setSelectedCollectionId("all")}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-2",
                selectedCollectionId === "all"
                  ? "bg-[#dfbb78] text-[#1c1507] border-[#dfbb78] shadow-[0_2px_12px_rgba(223,187,120,0.3)] font-bold"
                  : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              <span>Toutes les séries</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                selectedCollectionId === "all" ? "bg-black/20 text-[#1c1507]" : "bg-white/10 text-white/70"
              )}>
                170
              </span>
            </button>

            {/* Les 19 Bibliothèques */}
            {LDVELH_COLLECTIONS.map((c) => {
              const active = selectedCollectionId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCollectionId(c.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-2",
                    active
                      ? "bg-white/15 text-white border-[#dfbb78] shadow-[0_0_15px_rgba(223,187,120,0.2)]"
                      : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
                  )}
                  style={{
                    borderLeftColor: active ? c.accent : undefined,
                    borderLeftWidth: active ? "3px" : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.accent }}
                  />
                  <span>{c.name}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-white/80">
                    {c.totalBooks}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Détails de la bibliothèque sélectionnée */}
        {selectedCollection && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedCollection.accent }}
                />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {selectedCollection.name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  · {selectedCollection.author}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {selectedCollection.totalBooks} tomes
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                {selectedCollection.description}
              </p>
            </div>

            <Link
              href={`/shop?collection=${selectedCollection.id}`}
              className="text-xs text-[#dfbb78] hover:underline font-semibold flex items-center gap-1.5 shrink-0"
            >
              <span>Voir dans la boutique</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* GRILLE DES LIVRES (2026 UI) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Affichage de <strong>{filteredBooks.length}</strong> livre(s)
          </span>
          {selectedCollectionId !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCollectionId("all")}
              className="text-[#dfbb78] hover:underline"
            >
              Afficher toutes les collections
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((livre) => {
            const isAccessible = livre.isPlayable || livre.isFree || ownedSlugs.includes(livre.id);

            return (
              <article
                key={livre.id}
                className={cn(
                  "group relative rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden",
                  livre.isPlayable
                    ? "bg-[#111914] border-[#dfbb78]/40 shadow-[0_4px_25px_rgba(223,187,120,0.15)] hover:border-[#dfbb78]"
                    : "bg-[#0e1511]/85 border-white/[0.08] hover:border-white/20 hover:bg-[#121b16]"
                )}
              >
                {/* Image de couverture + badges */}
                <div className="relative aspect-[16/10] bg-[#080d0a] overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
                  {livre.couverture ? (
                    <img
                      src={livre.couverture}
                      alt={livre.titre}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback si l'image distante échoue
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  {/* Numéro de tome discret */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
                    Tome {String(livre.numero).padStart(2, "0")}
                  </div>

                  {/* Badge statut */}
                  <div className="absolute top-2.5 right-2.5">
                    {livre.isPlayable ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold backdrop-blur-md">
                        <Sparkles size={11} />
                        Jouable
                      </span>
                    ) : isAccessible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20 text-[10px] font-semibold backdrop-blur-md">
                        <CheckCircle2 size={11} />
                        Grimoire
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-muted-foreground border border-white/10 text-[10px] backdrop-blur-md">
                        <Lock size={10} />
                        Boutique
                      </span>
                    )}
                  </div>
                </div>

                {/* Métadonnées & Résumé */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#dfbb78]">
                      {livre.collectionName}
                    </p>
                    <h4 className="font-serif text-base font-bold text-foreground leading-snug group-hover:text-[#dfbb78] transition-colors line-clamp-1">
                      {livre.titre}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {livre.resume}
                    </p>
                  </div>

                  {/* Action selon le statut */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {livre.author}
                    </span>

                    {livre.isPlayable ? (
                      <Link
                        href="/jouer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dfbb78] text-[#1c1507] text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all"
                      >
                        <span>Lire</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <Link
                        href={`/shop?collection=${livre.collectionId}`}
                        className="inline-flex items-center gap-1 text-xs text-[#dfbb78] hover:underline font-semibold"
                      >
                        <span>Boutique</span>
                        <ChevronRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!filteredBooks.length && (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-white/[0.02] space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="font-serif text-lg text-foreground">
              Aucun grimoire ne correspond à votre recherche
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Essayez d&apos;autres mots-clés ou réinitialisez le filtre pour
              parcourir les 19 bibliothèques complètes.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCollectionId("all");
                setFilterMode("all");
              }}
              className="action-link text-xs h-9 px-4 mt-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* MODAL / SHEET : GRILLE DES 19 BIBLIOTHÈQUES (2026 UI) */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0c1410] border border-white/10 shadow-2xl overflow-hidden">
            {/* Header modal */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Library className="w-5 h-5 text-[#dfbb78]" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Les 19 Bibliothèques d&apos;Aventure
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCollectionModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Liste des collections */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {LDVELH_COLLECTIONS.map((c) => {
                const isSelected = selectedCollectionId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollectionId(c.id);
                      setShowCollectionModal(false);
                    }}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer",
                      isSelected
                        ? "bg-[#18241d] border-[#dfbb78]"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: c.accent }}
                      />
                      <div>
                        <p className="font-serif text-sm font-bold text-foreground">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.author} · {c.genre}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#dfbb78] shrink-0">
                      {c.totalBooks} tomes
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
