"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LDVELH_COLLECTIONS,
  LDVELHBook,
  getAllBooks,
} from "@/lib/ldvelh-collections";
import { charger } from "@/lib/lonewolf/sauvegarde";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Library,
  Play,
  Search,
  Swords,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BookRow, { ShopLink, type BookAccess } from "./BookRow";

interface CatalogueClientProps {
  ownedSlugs?: string[];
}

function accessOf(livre: LDVELHBook, ownedSlugs: string[]): BookAccess {
  if (livre.isPlayable) return "jouable";
  if (livre.isFree || ownedSlugs.includes(livre.id)) return "grimoire";
  return "verrouille";
}

function CatalogueContenu({ ownedSlugs = [] }: CatalogueClientProps) {
  const searchParams = useSearchParams();
  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "grimoire" | "playable">(
    "all",
  );
  const [showCollections, setShowCollections] = useState(false);
  const [paragrapheEnCours, setParagrapheEnCours] = useState<string | null>(
    null,
  );

  // Présélection depuis l'accueil ou la boutique (?collection=…).
  useEffect(() => {
    const id = searchParams.get("collection");
    if (id && LDVELH_COLLECTIONS.some((c) => c.id === id)) {
      setSelectedCollectionId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      setParagrapheEnCours(charger()?.state.paragraphe ?? null);
    } catch {
      setParagrapheEnCours(null);
    }
  }, []);

  const allBooks = useMemo(() => getAllBooks(), []);

  const filteredBooks = useMemo(() => {
    let pool = allBooks;
    if (selectedCollectionId !== "all") {
      pool = pool.filter((b) => b.collectionId === selectedCollectionId);
    }
    if (filterMode === "grimoire") {
      pool = pool.filter((b) => accessOf(b, ownedSlugs) !== "verrouille");
    } else if (filterMode === "playable") {
      pool = pool.filter((b) => b.isPlayable);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      pool = pool.filter(
        (b) =>
          b.titre.toLowerCase().includes(q) ||
          b.collectionName.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    return pool;
  }, [allBooks, selectedCollectionId, filterMode, searchQuery, ownedSlugs]);

  const selectedCollection = useMemo(
    () => LDVELH_COLLECTIONS.find((c) => c.id === selectedCollectionId),
    [selectedCollectionId],
  );

  const nbGrimoire = useMemo(
    () => allBooks.filter((b) => accessOf(b, ownedSlugs) !== "verrouille").length,
    [allBooks, ownedSlugs],
  );
  const nbJouable = useMemo(
    () => allBooks.filter((b) => b.isPlayable).length,
    [allBooks],
  );

  const hasFilters =
    searchQuery.trim() !== "" ||
    selectedCollectionId !== "all" ||
    filterMode !== "all";

  function resetFilters() {
    setSearchQuery("");
    setSelectedCollectionId("all");
    setFilterMode("all");
  }

  return (
    <div className="space-y-6">
      {/* ----- En-tête ramassé ----- */}
      <header className="page-head">
        <p className="eyebrow">Grimoires & chroniques</p>
        <h1>Bibliothèque</h1>
        <p className="stat-strip">
          <span>
            <strong>19</strong> séries
          </span>
          <span className="dot" aria-hidden="true">
            •
          </span>
          <span>
            <strong>170</strong> tomes
          </span>
          <span className="dot" aria-hidden="true">
            •
          </span>
          <span>
            <strong>{nbGrimoire}</strong> dans votre grimoire
          </span>
        </p>
      </header>

      {/* ----- Bento Reprendre + Pour toi (Spotify-style) ----- */}
      <section className="bento">
        <Link
          href={paragrapheEnCours ? "/jouer/aventure" : "/jouer"}
          className="bento-card bento-main card-gold group flex flex-col overflow-hidden"
        >
          <div className="relative h-28 overflow-hidden">
            <img
              src="/lonewolf/pdf/originals/p001-x4.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c130f] via-transparent to-transparent" />
            <span className="absolute left-3 top-3 pill pill-green">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {paragrapheEnCours ? `En cours — §${paragrapheEnCours}` : "Prêt à jouer"}
            </span>
          </div>
          <div className="p-3.5 flex items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif text-[15px] font-bold text-white">
                Loup Solitaire 01 · Les Maîtres des Ténèbres
              </span>
              <span className="block text-xs text-muted-foreground">350 § · 17 fins · Reprise instantanée</span>
            </span>
            <span className="btn btn-primary btn-sm shrink-0 btn-primary--hero">
              <Play size={15} className="fill-current" />
              <span className="hidden sm:inline">{paragrapheEnCours ? "Reprendre" : "Jouer"}</span>
            </span>
          </div>
        </Link>
        <div className="bento-card p-3.5 flex flex-col gap-2.5">
          <p className="eyebrow">Pour toi</p>
          <p className="text-sm font-bold leading-tight">Tu as aimé le Sommerlund ?</p>
          <p className="text-xs text-muted-foreground">NOVA-9 t&apos;attend : SF, 51 §, vaisseau hanté. Même moteur, nouvelle peur.</p>
          <Link href="/shop" className="btn btn-secondary btn-sm w-fit mt-auto">
            <Swords size={14} /> Découvrir NOVA-9
          </Link>
        </div>
        <div className="tavern-sign p-3.5 flex flex-col gap-2">
          <p className="text-xs font-bold flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> 19 séries · 170 tomes</p>
          <p className="text-xs text-muted-foreground">Du Sorcier de la Montagne de Feu à la Crypte du Dragon Émeraude.</p>
          <Link href="/shop" className="text-xs font-bold text-[#dfbb78] hover:underline">Explorer la taverne →</Link>
        </div>
      </section>

      {/* ----- Recherche + filtres collants ----- */}
      <div className="sticky-controls space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un tome, une série, un auteur…"
            aria-label="Rechercher dans la bibliothèque"
            className="field"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-white"
            >
              <X size={17} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar" role="group" aria-label="Filtrer par disponibilité">
          <FilterChip
            active={filterMode === "all"}
            onClick={() => setFilterMode("all")}
            label="Tout"
            count={allBooks.length}
          />
          <FilterChip
            active={filterMode === "grimoire"}
            onClick={() => setFilterMode("grimoire")}
            label="Mon grimoire"
            count={nbGrimoire}
          />
          <FilterChip
            active={filterMode === "playable"}
            onClick={() => setFilterMode("playable")}
            label="Jouables"
            count={nbJouable}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar" role="group" aria-label="Filtrer par série">
          <button
            type="button"
            onClick={() => setSelectedCollectionId("all")}
            aria-pressed={selectedCollectionId === "all"}
            className="chip"
          >
            Toutes les séries
          </button>
          {LDVELH_COLLECTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCollectionId(c.id)}
              aria-pressed={selectedCollectionId === c.id}
              className="chip"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.accent }}
                aria-hidden="true"
              />
              {c.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCollections(true)}
            className="chip shrink-0"
          >
            <Library size={15} />
            Les 19 séries
          </button>
        </div>
      </div>

      {/* ----- Série sélectionnée : une ligne ----- */}
      {selectedCollection && (
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            <span
              className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-baseline"
              style={{ backgroundColor: selectedCollection.accent }}
              aria-hidden="true"
            />
            <strong className="font-serif text-[15px] text-foreground">
              {selectedCollection.name}
            </strong>{" "}
            · {selectedCollection.totalBooks} tomes ·{" "}
            {selectedCollection.author}
          </p>
          <button
            type="button"
            onClick={() => setSelectedCollectionId("all")}
            className="shrink-0 text-[13px] font-semibold text-[#dfbb78] hover:underline"
          >
            Tout voir
          </button>
        </div>
      )}

      {/* ----- Résultats ----- */}
      <section aria-live="polite" className="space-y-3">
        <p className="text-[13px] text-muted-foreground">
          <strong className="text-foreground">{filteredBooks.length}</strong>{" "}
          livre{filteredBooks.length > 1 ? "s" : ""} affiché
          {filteredBooks.length > 1 ? "s" : ""}
          {hasFilters && (
            <>
              {" · "}
              <button
                type="button"
                onClick={resetFilters}
                className="font-semibold text-[#dfbb78] hover:underline"
              >
                Réinitialiser
              </button>
            </>
          )}
        </p>

        {/* Mobile : liste compacte. Bureau : grille de cartes. */}
        <div className="grid gap-2.5 sm:hidden">
          {filteredBooks.map((livre) => (
            <BookRow
              key={livre.id}
              livre={livre}
              access={accessOf(livre, ownedSlugs)}
              action={
                livre.isPlayable ? (
                  <Link href="/jouer" className="btn btn-primary btn-sm !px-3.5">
                    <Swords size={15} />
                    Lire
                  </Link>
                ) : (
                  <ShopLink collectionId={livre.collectionId} />
                )
              }
            />
          ))}
        </div>
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((livre) => (
            <BookRow
              key={livre.id}
              livre={livre}
              layout="card"
              access={accessOf(livre, ownedSlugs)}
              action={
                livre.isPlayable ? (
                  <Link
                    href={`/jouer?livre=${livre.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Swords size={15} />
                    Lire
                  </Link>
                ) : (
                  <ShopLink collectionId={livre.collectionId} />
                )
              }
            />
          ))}
        </div>

        {!filteredBooks.length && (
          <div className="card space-y-2 p-8 text-center sm:p-12">
            <BookOpen size={32} className="mx-auto text-muted-foreground" />
            <p className="font-serif text-lg font-bold text-foreground">
              Aucun grimoire trouvé
            </p>
            <p className="mx-auto max-w-sm text-[13px] text-muted-foreground">
              Essayez d&apos;autres mots-clés ou réinitialisez les filtres pour
              parcourir les 19 bibliothèques.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-secondary btn-sm mt-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* ----- Les 19 séries : feuille basse sur mobile ----- */}
      {showCollections && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowCollections(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Les 19 bibliothèques d'aventure"
        >
          <div
            className="flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0c1410] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                <Library size={19} className="text-[#dfbb78]" />
                Les 19 séries
              </h3>
              <button
                type="button"
                onClick={() => setShowCollections(false)}
                aria-label="Fermer"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-muted-foreground hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
              {LDVELH_COLLECTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCollectionId(c.id);
                    setShowCollections(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                    selectedCollectionId === c.id
                      ? "border-[#dfbb78] bg-[#18241d]"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06]",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: c.accent }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-[15px] font-bold text-foreground">
                        {c.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {c.author} · {c.genre}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    {c.totalBooks} tomes
                    <ChevronRight size={15} className="text-[#dfbb78]" />
                  </span>
                </button>
              ))}
            </div>
            <div
              className="pb-[env(safe-area-inset-bottom)]"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* ----- Accès boutique ----- */}
      <Link
        href="/shop"
        className="card group flex items-center gap-3 p-4 transition-colors hover:border-[#dfbb78]/40"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-foreground">
            Agrandir votre grimoire
          </span>
          <span className="block truncate text-[13px] text-muted-foreground">
            Débloquez de nouveaux tomes dans la boutique
          </span>
        </span>
        <span className="btn btn-secondary btn-sm shrink-0">
          Boutique
          <ArrowRight size={15} />
        </span>
      </Link>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="chip shrink-0"
    >
      {label}
      <span className="count">{count}</span>
    </button>
  );
}

export default function CatalogueClient(props: CatalogueClientProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4" aria-hidden="true">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
      }
    >
      <CatalogueContenu {...props} />
    </Suspense>
  );
}
