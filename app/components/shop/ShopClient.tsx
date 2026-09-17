"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LDVELH_COLLECTIONS,
  LDVELHCollection,
  LDVELHBook,
  getAllCollections,
  getAllBooks,
} from "@/lib/ldvelh-collections";
import {
  Gem,
  Shield,
  FlaskConical,
  BookOpen,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
  Library,
  ChevronRight,
  Filter,
  Check,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    name: "Coffret Kaï du Sommerlund",
    gems_amount: 600,
    bonus_gems: 100,
    price_usd: 9.99,
  },
  {
    id: "pack-vault",
    name: "Trésor des Seigneurs des Ombres",
    gems_amount: 1500,
    bonus_gems: 400,
    price_usd: 19.99,
  },
];

const defaultItems: Item[] = [
  {
    id: "relique-laumspur",
    name: "Potion de Laumspur",
    description: "Restaure 4 points d'Endurance après un affrontement sanglant.",
    price_gems: 40,
    item_type: "potion",
  },
  {
    id: "relique-alether",
    name: "Fiole d'Aléther",
    description: "Ajoute +2 en Habileté pour la durée d'un combat décisif.",
    price_gems: 60,
    item_type: "potion",
  },
  {
    id: "relique-bouclier",
    name: "Bouclier en Fer Kaï",
    description: "Confère un bonus permanent de +2 en Habileté défensive.",
    price_gems: 120,
    item_type: "armor",
  },
  {
    id: "relique-cotte",
    name: "Cotte de Mailles Forgée",
    description: "Augmente l'Endurance maximale de départ de +4 points.",
    price_gems: 160,
    item_type: "armor",
  },
];

export default function ShopClient({
  gemPacks = [],
  items = [],
  initialGems = 250,
}: {
  gemPacks?: Pack[];
  items?: Item[];
  initialGems?: number;
}) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("defis-fantastiques");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"bibliotheques" | "tresors" | "equipement">("bibliotheques");
  const [userGems, setUserGems] = useState(initialGems);
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([
    "loup-solitaire-01",
    "loup-solitaire-02",
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  const collections = useMemo(() => getAllCollections(), []);
  const allBooks = useMemo(() => getAllBooks(), []);

  const packs = gemPacks.length ? gemPacks : defaultPacks;
  const equipment = items.length ? items : defaultItems;

  const currentCollection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId) || collections[0],
    [collections, selectedCollectionId]
  );

  const filteredBooks = useMemo(() => {
    let pool = currentCollection.books;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = allBooks.filter(
        (b) =>
          b.titre.toLowerCase().includes(q) ||
          b.collectionName.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.resume.toLowerCase().includes(q)
      );
    }
    return pool;
  }, [currentCollection, searchQuery, allBooks]);

  function handleBuyBook(book: LDVELHBook) {
    if (purchasedBooks.includes(book.id) || book.isFree) return;

    if (userGems < book.priceGems) {
      setNotification(`Gemmes insuffisantes pour débloquer "${book.titre}".`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setUserGems((prev) => prev - book.priceGems);
    setPurchasedBooks((prev) => [...prev, book.id]);
    setNotification(`Félicitations ! "${book.titre}" a été ajouté à votre bibliothèque.`);
    setTimeout(() => setNotification(null), 3500);
  }

  function handleBuyPack(pack: Pack) {
    setUserGems((prev) => prev + pack.gems_amount + (pack.bonus_gems || 0));
    setNotification(`+${pack.gems_amount + (pack.bonus_gems || 0)} gemmes ajoutées à votre bourse !`);
    setTimeout(() => setNotification(null), 3000);
  }

  return (
    <div className="space-y-8">
      {/* Toast notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-[#132018] border border-[#dfbb78] text-[#dfbb78] shadow-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* En-tête de la Boutique & Solde de Gemmes */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-2">
        <div className="space-y-2">
          <p className="eyebrow flex items-center gap-2">
            <span className="w-4 h-px bg-[#dfbb78]" />
            L&apos;Échoppe des Arcanes & des Destins
          </p>
          <h1 className="page-title text-foreground">
            La Boutique des Aventures
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
            Choisissez votre prochaine saga parmi les 19 bibliothèques LDVELH.
            Chaque tome acquis rejoint votre bibliothèque personnelle.
          </p>
        </div>

        {/* Solde de gemmes interactif */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#18261e] to-[#0e1612] border border-[#dfbb78]/30 shadow-lg flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#dfbb78]/15 border border-[#dfbb78]/40 flex items-center justify-center text-[#dfbb78]">
            <Gem size={26} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
              Votre Bourse
            </p>
            <p className="text-2xl font-serif font-bold text-[#dfbb78] flex items-center gap-1.5">
              <span>{userGems.toLocaleString("fr-FR")}</span>
              <span className="text-xs font-sans text-muted-foreground">gemmes</span>
            </p>
          </div>
        </div>
      </header>

      {/* Onglets principaux de la boutique */}
      <div className="flex border-b border-white/10 gap-2 sm:gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("bibliotheques");
            setSearchQuery("");
          }}
          className={cn(
            "pb-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer",
            activeTab === "bibliotheques"
              ? "border-[#dfbb78] text-[#dfbb78]"
              : "border-transparent text-muted-foreground hover:text-white"
          )}
        >
          <Library size={17} />
          <span>Les 19 Bibliothèques</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tresors")}
          className={cn(
            "pb-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer",
            activeTab === "tresors"
              ? "border-[#dfbb78] text-[#dfbb78]"
              : "border-transparent text-muted-foreground hover:text-white"
          )}
        >
          <Gem size={17} />
          <span>Bourses de Gemmes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("equipement")}
          className={cn(
            "pb-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer",
            activeTab === "equipement"
              ? "border-[#dfbb78] text-[#dfbb78]"
              : "border-transparent text-muted-foreground hover:text-white"
          )}
        >
          <Shield size={17} />
          <span>Échoppe de l&apos;Aventurier</span>
        </button>
      </div>

      {/* ONGLET 1 : LES 19 BIBLIOTHÈQUES LDVELH */}
      {activeTab === "bibliotheques" && (
        <div className="space-y-6">
          {/* Recherche globale */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une aventure ou un tome précis..."
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

          {/* Sélecteur carrousel des 19 Bibliothèques */}
          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Choisissez votre collection ({collections.length}) :
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-2 px-2 scroll-smooth">
                {collections.map((c) => {
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
          )}

          {/* Fiche de la Bibliothèque sélectionnée */}
          {!searchQuery && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121c16] via-[#0e1612] to-[#0a110d] border border-white/10 shadow-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentCollection.accent }}
                  />
                  <h2 className="font-serif text-2xl font-bold text-white">
                    {currentCollection.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    par {currentCollection.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-[#dfbb78] border border-white/10">
                    {currentCollection.totalBooks} tomes dans cette bibliothèque
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {currentCollection.description}
              </p>
            </div>
          )}

          {/* Grille des Livres disponibles à l'achat / déblocage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {searchQuery
                  ? `Résultats de recherche : ${filteredBooks.length} tomes trouvés`
                  : `Tomes de la collection (${filteredBooks.length})`}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((livre) => {
                const isOwned = purchasedBooks.includes(livre.id) || livre.isFree;

                return (
                  <article
                    key={livre.id}
                    className="group relative rounded-2xl border border-white/[0.08] bg-[#0e1511]/85 hover:border-white/20 hover:bg-[#121b16] transition-all flex flex-col justify-between overflow-hidden p-4 space-y-4"
                  >
                    <div className="flex gap-4">
                      {/* Vignette couverture */}
                      <div className="w-20 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-[#080d0a] border border-white/10 shadow">
                        {livre.couverture ? (
                          <img
                            src={livre.couverture}
                            alt={livre.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#dfbb78]">
                            <BookOpen size={24} />
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#dfbb78]">
                          <span>Tome {String(livre.numero).padStart(2, "0")}</span>
                          {isOwned && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check size={11} /> Acquis
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-sm font-bold text-foreground line-clamp-1 group-hover:text-[#dfbb78] transition-colors">
                          {livre.titre}
                        </h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {livre.resume}
                        </p>
                      </div>
                    </div>

                    {/* Prix et bouton d'acquisition */}
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div>
                        {livre.isFree ? (
                          <span className="text-xs font-semibold text-emerald-300">
                            Offert à l&apos;ouverture
                          </span>
                        ) : (
                          <span className="text-xs font-serif font-bold text-[#dfbb78] flex items-center gap-1">
                            <Gem size={13} />
                            <span>{livre.priceGems}</span>
                            <span className="text-[10px] font-sans text-muted-foreground">gemmes</span>
                          </span>
                        )}
                      </div>

                      {isOwned ? (
                        <Link
                          href="/catalogue"
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-foreground font-semibold flex items-center gap-1 transition-all"
                        >
                          <BookOpen size={13} />
                          <span>Ouvrir</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyBook(livre)}
                          className="px-3 py-1.5 rounded-xl bg-[#dfbb78] hover:brightness-110 active:scale-95 text-[#1c1507] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <ShoppingBag size={13} />
                          <span>Acquérir</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2 : PACKS DE GEMMES */}
      {activeTab === "tresors" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Bourses & Coffrets de Gemmes
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Obtenez des gemmes arcaniques pour débloquer de nouveaux grimoires
              et aventures à emporter sous les arbres de la forêt nocturne.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className="relative rounded-3xl p-6 bg-gradient-to-b from-[#121c16] to-[#0c130f] border border-white/10 hover:border-[#dfbb78]/50 shadow-xl flex flex-col justify-between gap-5 transition-all group"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#dfbb78]/15 border border-[#dfbb78]/30 flex items-center justify-center text-[#dfbb78] group-hover:scale-105 transition-transform">
                    <Gem size={30} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {pack.name}
                    </h3>
                    <p className="text-2xl font-serif font-bold text-[#dfbb78] mt-1">
                      {pack.gems_amount.toLocaleString("fr-FR")}{" "}
                      <span className="text-xs font-sans text-muted-foreground">gemmes</span>
                    </p>
                    {!!pack.bonus_gems && (
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                        +{pack.bonus_gems} gemmes bonus offertes
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyPack(pack)}
                  className="w-full h-11 rounded-xl bg-[#dfbb78] text-[#1c1507] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Obtenir ({pack.price_usd ? `${pack.price_usd} €` : "Aperçu"})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET 3 : ÉCHOPPE DE L'AVENTURIER */}
      {activeTab === "equipement" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Équipements & Potions Kaï
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Des objets de survie pour enrichir vos périples dans le Magnamund
              et les labyrinthes de Titan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {equipment.map((item) => {
              const Icon = item.item_type === "potion" ? FlaskConical : Shield;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0e1612]/80 border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfbb78] shrink-0">
                    <Icon size={24} />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-serif text-base font-bold text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#dfbb78]">
                        {item.price_gems} gemmes
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (userGems < (item.price_gems || 0)) {
                            setNotification("Solde de gemmes insuffisant.");
                            setTimeout(() => setNotification(null), 3000);
                            return;
                          }
                          setUserGems((prev) => prev - (item.price_gems || 0));
                          setNotification(`${item.name} ajouté à votre sacoche !`);
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#dfbb78] hover:text-[#1c1507] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
