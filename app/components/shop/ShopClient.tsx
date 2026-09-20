"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LDVELHBook,
  getAllBooks,
  getAllCollections,
} from "@/lib/ldvelh-collections";
import BookRow, { type BookAccess } from "@/components/catalogue/BookRow";
import {
  BookOpen,
  Check,
  Gem,
  Library,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GemIcon from "@/components/shared/GemIcon";
import { haptic, hapticSuccess } from "@/lib/haptics";
import { sfxCoin, sfxSuccess } from "@/lib/sound";

interface Pack {
  id: string;
  name: string;
  gems_amount: number;
  bonus_gems: number | null;
  price_usd?: number;
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  price_gems: number | null;
  item_type: string;
}

const defaultPacks: Pack[] = [
  {
    id: "pack-purse",
    name: "Bourse de l'Aventurier",
    gems_amount: 150,
    bonus_gems: 0,
    price_usd: 2.99,
  },
  {
    id: "pack-chest",
    name: "Coffret Kaï",
    gems_amount: 600,
    bonus_gems: 100,
    price_usd: 9.99,
  },
  {
    id: "pack-vault",
    name: "Trésor des Ténèbres",
    gems_amount: 1500,
    bonus_gems: 400,
    price_usd: 19.99,
  },
];

type Tab = "bibliotheques" | "tresors";

const TABS: { id: Tab; label: string; icon: typeof Library }[] = [
  { id: "bibliotheques", label: "Livres", icon: Library },
  { id: "tresors", label: "Gemmes", icon: Gem },
];

function ShopContenu({
  gemPacks = [],
  items = [],
  initialGems = 250,
}: {
  gemPacks?: Pack[];
  items?: Item[];
  initialGems?: number;
}) {
  const searchParams = useSearchParams();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    "defis-fantastiques",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bibliotheques");
  const [userGems, setUserGems] = useState(initialGems);
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([
    "loup-solitaire-01",
    "loup-solitaire-02",
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("collection");
    if (id) setSelectedCollectionId(id);
  }, [searchParams]);

  const collections = useMemo(() => getAllCollections(), []);
  const allBooks = useMemo(() => getAllBooks(), []);
  const packs = gemPacks.length ? gemPacks : defaultPacks;

  const currentCollection = useMemo(
    () =>
      collections.find((c) => c.id === selectedCollectionId) || collections[0],
    [collections, selectedCollectionId],
  );

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return allBooks.filter(
        (b) =>
          b.titre.toLowerCase().includes(q) ||
          b.collectionName.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    return currentCollection.books;
  }, [currentCollection, searchQuery, allBooks]);

  function notify(message: string) {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 3200);
  }

  function accessOf(book: LDVELHBook): BookAccess {
    if (book.isPlayable) return "jouable";
    if (book.isFree || purchasedBooks.includes(book.id)) return "grimoire";
    return "verrouille";
  }

  function handleBuyBook(book: LDVELHBook) {
    if (purchasedBooks.includes(book.id) || book.isFree) return;
    if (userGems < book.priceGems) {
      notify(`Gemmes insuffisantes pour « ${book.titre} ».`);
      return;
    }
    setUserGems((prev) => prev - book.priceGems);
    setPurchasedBooks((prev) => [...prev, book.id]);
    notify(`« ${book.titre} » rejoint votre bibliothèque.`);
  }

  function handleBuyPack(pack: Pack) {
    const total = pack.gems_amount + (pack.bonus_gems || 0);
    setUserGems((prev) => prev + total);
    notify(`+${total} gemmes ajoutées à votre bourse !`);
  }

  // Équipement supprimé P0.3 — loot in-game uniquement. Boutique = Livres + Gemmes.

  return (
    <div className="space-y-6">
      {notification && (
        <div
          role="status"
          className="fixed inset-x-4 top-[68px] z-50 flex items-center gap-3 rounded-2xl border border-[#dfbb78] bg-[#132018] p-4 text-sm text-[#dfbb78] shadow-2xl sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <Sparkles size={19} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ----- En-tête Taverne + bourse ----- */}
      <header className="tavern-sign flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="page-head">
          <p className="eyebrow flex items-center gap-2">🍺 Taverne de Holmgard <span className="hidden sm:inline text-white/30">·</span> <span className="hidden sm:inline text-xs text-muted-foreground normal-case tracking-normal font-medium">L&apos;échoppe des destins</span></p>
          <h1>Boutique</h1>
          <p className="text-xs text-muted-foreground/80">Gemmes arcaniques · Livres scellés · Aucune potion à vendre — le butin se mérite en jeu.</p>
        </div>
        <div
          className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-[#dfbb78]/30 bg-[#121c16] px-3.5 py-2.5"
          aria-live="polite"
          aria-label={`Votre bourse : ${userGems} gemmes`}
        >
          <GemIcon size="sm" variant="gold" title="" />
          <span className="font-serif text-lg font-bold tabular-nums text-[#dfbb78]">
            {userGems.toLocaleString("fr-FR")}
          </span>
        </div>
      </header>

      {/* ----- Onglets segmentés (2 onglets P0.3) ----- */}
      <div
        className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1"
        role="tablist"
        aria-label="Rayons de la boutique"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold transition-all",
              activeTab === id
                ? "bg-[#dfbb78] text-[#1c1507] shadow-sm"
                : "text-muted-foreground hover:text-white",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "bibliotheques" && (
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une aventure…"
              aria-label="Rechercher dans la boutique"
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

          {!searchQuery && (
            <div
              className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar"
              role="group"
              aria-label="Choisir une série"
            >
              {collections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCollectionId(c.id)}
                  aria-pressed={selectedCollectionId === c.id}
                  className="chip shrink-0"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.accent }}
                    aria-hidden="true"
                  />
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
            <p className="truncate text-sm text-muted-foreground">
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-baseline"
                style={{ backgroundColor: currentCollection.accent }}
                aria-hidden="true"
              />
              <strong className="font-serif text-[15px] text-foreground">
                {currentCollection.name}
              </strong>{" "}
              · {currentCollection.totalBooks} tomes
            </p>
          )}

          <div className="grid gap-2.5 sm:hidden">
            {filteredBooks.map((livre) => (
              <BookRow
                key={livre.id}
                livre={livre}
                access={accessOf(livre)}
                action={
                  <BookAction
                    livre={livre}
                    owned={
                      purchasedBooks.includes(livre.id) || livre.isFree
                    }
                    onBuy={() => handleBuyBook(livre)}
                  />
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
                access={accessOf(livre)}
                action={
                  <BookAction
                    livre={livre}
                    owned={
                      purchasedBooks.includes(livre.id) || livre.isFree
                    }
                    onBuy={() => handleBuyBook(livre)}
                  />
                }
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "tresors" && (
        <div className="space-y-4">
          <p className="page-sub">
            Des gemmes arcaniques pour débloquer de nouveaux grimoires. Bonus de taverne inclus.
          </p>
          <div className="rail sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:p-0 sm:m-0">
            {packs.map((pack) => {
              const isBest = pack.id === "pack-chest";
              return (
              <div
                key={pack.id}
                className={cn("card flex w-64 flex-col justify-between gap-4 p-5 sm:w-auto relative overflow-hidden", isBest && "border-[#dfbb78]/40 shadow-[0_8px_24px_rgba(223,187,120,0.15)]")}
              >
                {isBest && <span className="absolute right-3 top-3 rounded-full bg-[#dfbb78] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1c1507]">Populaire</span>}
                <div className="space-y-2">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#dfbb78]/30 bg-[#dfbb78]/10">
                    <GemIcon size="md" variant="gold" title="" />
                  </span>
                  <h3 className="font-serif text-base font-bold text-white">
                    {pack.name}
                  </h3>
                  <p className="font-serif text-xl font-bold text-[#dfbb78] flex items-center gap-1.5">
                    <GemIcon size="xs" variant="ice" title="" /> {pack.gems_amount.toLocaleString("fr-FR")}{" "}
                    <span className="font-sans text-xs font-normal text-muted-foreground">
                      gemmes
                    </span>
                  </p>
                  {!!pack.bonus_gems && (
                    <p className="text-xs font-semibold text-emerald-400">
                      +{pack.bonus_gems} bonus offertes
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground/70">Paiement sécurisé · RevenueCat</p>
                </div>
                <button
                  type="button"
                  onClick={() => { hapticSuccess(); sfxCoin(); handleBuyPack(pack); }}
                  className={cn("btn btn-sm btn-block", isBest ? "btn-primary btn-primary--hero" : "btn-primary")}
                >
                  Obtenir ·{" "}
                  {pack.price_usd ? `${pack.price_usd.toFixed(2).replace(".", ",")} €` : "Aperçu"}
                </button>
              </div>
            )})}
          </div>
          <div className="tavern-sign p-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 border border-white/10">🛡️</span>
            <span>Besoin d&apos;équipement ? Il se trouve <strong className="text-foreground">dans l&apos;aventure</strong>, pas à la boutique. Fouillez les coffres du Magnamund.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BookAction({
  livre,
  owned,
  onBuy,
}: {
  livre: LDVELHBook;
  owned: boolean;
  onBuy: () => void;
}) {
  if (owned) {
    return (
      <Link
        href="/catalogue"
        className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-emerald-300 hover:underline"
      >
        <BookOpen size={14} />
        Ouvrir
      </Link>
    );
  }
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#dfbb78]">
        <GemIcon size="xs" variant="ice" title="" />
        {livre.priceGems}
      </span>
      <button
        type="button"
        onClick={() => { haptic("medium"); onBuy(); }}
        className="btn btn-primary btn-sm !min-h-[36px] !px-3"
      >
        <ShoppingBag size={14} />
        Acquérir
      </button>
    </span>
  );
}

export default function ShopClient(props: {
  gemPacks?: Pack[];
  items?: Item[];
  initialGems?: number;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4" aria-hidden="true">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
      }
    >
      <ShopContenu {...props} />
    </Suspense>
  );
}
